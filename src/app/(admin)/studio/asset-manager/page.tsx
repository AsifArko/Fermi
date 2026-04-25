'use client';

import { createClient } from '@sanity/client';
import {
  Eye,
  Download,
  Trash2,
  Search,
  RefreshCw,
  FileText,
  Image,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Filter,
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Asset {
  _id: string;
  _type: 'sanity.imageAsset' | 'sanity.fileAsset';
  originalFilename?: string;
  url?: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
    };
    size?: number;
  };
  mimeType?: string;
  createdAt: string;
  referenceCount?: number;
}

interface AssetReference {
  courseTitle?: string;
  courseSlug?: string | null;
  courseId?: string;
  moduleTitle?: string;
  moduleSlug?: string | null;
  lessonTitle?: string;
  lessonId?: string;
  lessonSlug?: string | null;
}

interface AssetWithReferences extends Asset {
  references?: AssetReference[];
}

type SortField = 'name' | 'type' | 'size' | 'created' | 'references';
type SortDirection = 'asc' | 'desc';
type GroupBy = 'none' | 'type' | 'references' | 'date';
type FileTypeFilter = 'all' | 'image' | 'document' | 'pdf' | 'notebook';

export default function AssetManagerPage() {
  const config: {
    projectId: string;
    dataset: string;
    apiVersion: string;
    useCdn: boolean;
    token?: string;
  } = {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: '2024-01-01',
    useCdn: false,
  };

  if (process.env.SANITY_API_ADMIN_TOKEN) {
    config.token = process.env.SANITY_API_ADMIN_TOKEN;
  }

  const client = createClient(config);

  const [assets, setAssets] = useState<AssetWithReferences[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] =
    useState<AssetWithReferences | null>(null);
  const [sortField] = useState<SortField>('created');
  const [sortDirection] = useState<SortDirection>('desc');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>('all');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(
    null
  );

  const fetchAssets = async () => {
    try {
      setLoading(true);

      // Fetch all image and file assets
      const imageAssets = await client.fetch(`
        *[_type == "sanity.imageAsset"] {
          _id,
          _type,
          originalFilename,
          url,
          metadata,
          mimeType,
          createdAt
        } | order(createdAt desc)
      `);

      const fileAssets = await client.fetch(`
        *[_type == "sanity.fileAsset"] {
          _id,
          _type,
          originalFilename,
          url,
          metadata,
          mimeType,
          createdAt
        } | order(createdAt desc)
      `);

      const allAssets = [...imageAssets, ...fileAssets];

      // Get reference counts for all assets - simple query to find which lessons use each asset
      const assetsWithReferences = await Promise.all(
        allAssets.map(async asset => {
          const refCount = await client.fetch(
            `
            count(*[_type == "lesson" && notebookFile.asset._ref == $assetId])
          `,
            { assetId: asset._id }
          );

          return {
            ...asset,
            referenceCount: refCount,
          };
        })
      );

      setAssets(assetsWithReferences);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchAssetReferences = async (assetId: string) => {
    try {
      // Simple query to find courses that use this asset
      const courses = await client.fetch(
        `
        *[_type == "course" && (image.asset._ref == $assetId || count(modules[].lessons[notebookFile.asset._ref == $assetId]) > 0)] {
          _id,
          title,
          slug,
          modules[]-> {
            _id,
            title,
            lessons[]-> {
              _id,
              title,
              notebookFile
            }
          }
        }
      `,
        { assetId }
      );

      const references: AssetReference[] = [];

      courses.forEach(
        (course: {
          _id: string;
          title?: string;
          slug?: { current?: string };
          image?: { asset?: { _ref: string } };
          modules?: Array<{
            title?: string;
            lessons?: Array<{
              _id: string;
              title?: string;
              notebookFile?: { asset?: { _ref: string } };
            }>;
          }>;
        }) => {
          // Check course image
          if (course.image?.asset?._ref === assetId) {
            const reference: {
              courseId: string;
              moduleTitle: string;
              moduleSlug: null;
              lessonTitle: string;
              lessonId: string;
              lessonSlug: null;
              courseTitle?: string;
              courseSlug?: string | null;
            } = {
              courseId: course._id,
              moduleTitle: 'Course Image',
              moduleSlug: null,
              lessonTitle: 'Course Image',
              lessonId: course._id,
              lessonSlug: null,
            };

            if (course.title) reference.courseTitle = course.title;
            if (course.slug?.current)
              reference.courseSlug = course.slug.current;

            references.push(reference);
          }

          // Check lessons
          course.modules?.forEach(module => {
            module.lessons?.forEach(lesson => {
              if (lesson.notebookFile?.asset?._ref === assetId) {
                const reference: {
                  courseId: string;
                  moduleTitle: string;
                  moduleSlug: null;
                  lessonId: string;
                  lessonSlug: null;
                  courseTitle?: string;
                  courseSlug?: string | null;
                  lessonTitle?: string;
                } = {
                  courseId: course._id,
                  moduleTitle: module.title || 'Unknown Module',
                  moduleSlug: null,
                  lessonId: lesson._id,
                  lessonSlug: null,
                };

                if (course.title) reference.courseTitle = course.title;
                if (course.slug?.current)
                  reference.courseSlug = course.slug.current;
                if (lesson.title) reference.lessonTitle = lesson.title;

                references.push(reference);
              }
            });
          });
        }
      );

      return references;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const deleteAsset = async (assetId: string) => {
    try {
      setDeleting(assetId);

      // First, check if the asset exists and get its details
      const assetToDelete = assets.find(a => a._id === assetId);
      if (!assetToDelete) {
        throw new Error('Asset not found in local state');
      }

      // Delete the asset from Sanity CDN using the proper mutation
      // Delete the asset from Sanity CDN using the standard method
      await client.delete(assetId);

      // Wait a moment for the deletion to propagate
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify deletion by trying to fetch the asset
      try {
        await client.getDocument(assetId);
        throw new Error('Asset deletion failed - asset still exists');
      } catch (fetchError: unknown) {
        const error = fetchError as { statusCode?: number; message?: string };
        if (error.statusCode === 404 || error.message?.includes('not found')) {
          // Asset successfully deleted (404 means not found)

          // Remove from local state
          setAssets(assets.filter(asset => asset._id !== assetId));

          // Clear selection if the deleted asset was selected
          if (selectedAsset?._id === assetId) {
            setSelectedAsset(null);
          }

          // Show success message
          const assetName = assetToDelete.originalFilename || 'Asset';
          setShowSuccessMessage(
            `${assetName} deleted successfully from Sanity CDN`
          );

          // Auto-hide success message after 3 seconds
          setTimeout(() => setShowSuccessMessage(null), 3000);
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      // Check if it's a permission error
      if (
        error instanceof Error &&
        (error.message.includes('403') ||
          error.message.includes('Insufficient permissions'))
      ) {
        alert(
          'Permission denied. Your SANITY_API_ADMIN_TOKEN needs "delete" and "update" permissions. Please check your token in Sanity project settings.'
        );
      } else if (error instanceof Error && error.message.includes('404')) {
        alert('Asset not found. It may have already been deleted.');
      } else if (
        error instanceof Error &&
        error.message.includes('Asset deletion failed')
      ) {
        alert('Failed to delete asset from CDN. Please try again.');
      } else {
        alert(
          `Failed to delete asset: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    } finally {
      setDeleting(null);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFileSizeInBytes = (asset: AssetWithReferences) => {
    return asset.metadata?.size || 0;
  };

  const getReferenceCount = (asset: AssetWithReferences) => {
    return asset.references?.length || 0;
  };

  const getDateInMs = (asset: AssetWithReferences) => {
    return new Date(asset.createdAt).getTime();
  };

  const getFileType = (asset: AssetWithReferences): FileTypeFilter => {
    const mimeType = asset.mimeType?.toLowerCase() || '';
    const filename = asset.originalFilename?.toLowerCase() || '';

    if (
      mimeType.startsWith('image/') ||
      filename.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/)
    ) {
      return 'image';
    }
    if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) {
      return 'pdf';
    }

    if (filename.endsWith('.ipynb')) {
      return 'notebook';
    }
    if (
      mimeType.includes('document') ||
      mimeType.includes('word') ||
      mimeType.includes('excel') ||
      filename.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/)
    ) {
      return 'document';
    }
    return 'document'; // Default to document for any other file types
  };

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch =
        asset.originalFilename
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        asset.mimeType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFileType =
        fileTypeFilter === 'all' || getFileType(asset) === fileTypeFilter;

      return matchesSearch && matchesFileType;
    });
  }, [assets, searchTerm, fileTypeFilter]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.originalFilename || '';
          bValue = b.originalFilename || '';
          break;
        case 'type':
          aValue = a._type;
          bValue = b._type;
          break;
        case 'size':
          aValue = getFileSizeInBytes(a);
          bValue = getFileSizeInBytes(b);
          break;
        case 'created':
          aValue = getDateInMs(a);
          bValue = getDateInMs(b);
          break;
        case 'references':
          aValue = getReferenceCount(a);
          bValue = getReferenceCount(b);
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredAssets, sortField, sortDirection]);

  const groupedAssets = useMemo(() => {
    if (groupBy === 'none') return sortedAssets;

    return sortedAssets.reduce(
      (
        groups: Record<string, AssetWithReferences[]>,
        asset: AssetWithReferences
      ) => {
        let groupKey = '';

        switch (groupBy) {
          case 'type':
            groupKey =
              asset._type === 'sanity.imageAsset' ? 'Images' : 'Documents';
            break;
          case 'references':
            const refCount = getReferenceCount(asset);
            groupKey = refCount > 0 ? 'In Use' : 'Unused';
            break;
          case 'date':
            const date = new Date(asset.createdAt);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) groupKey = 'This Week';
            else if (diffDays <= 30) groupKey = 'This Month';
            else if (diffDays <= 90) groupKey = 'Last 3 Months';
            else groupKey = 'Older';
            break;
        }

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(asset);
        return groups;
      },
      {} as Record<string, AssetWithReferences[]>
    );
  }, [sortedAssets, groupBy]);

  const toggleGroupCollapse = (groupName: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupName)) {
      newCollapsed.delete(groupName);
    } else {
      newCollapsed.add(groupName);
    }
    setCollapsedGroups(newCollapsed);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center space-y-4'>
          <div className='w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto'></div>
          <p className='text-muted-foreground text-lg'>
            Loading your assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Success Message */}
      {showSuccessMessage && (
        <div className='fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right-2'>
          <div className='w-2 h-2 bg-white rounded-full'></div>
          {showSuccessMessage}
        </div>
      )}

      {/* Header */}
      <div className='border-b border-border/50 bg-card/50 backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold text-foreground flex items-center gap-3'>
                <FolderOpen className='w-8 h-8 text-primary' />
                Asset Manager
              </h1>
            </div>

            <Button
              onClick={fetchAssets}
              variant='outline'
              size='lg'
              className='gap-2 hover:bg-accent/50'
            >
              <RefreshCw className='w-4 h-4' />
              Refresh Assets
            </Button>
          </div>

          {/* Search and Filters */}
          <div className='mt-6 flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <input
                type='text'
                placeholder='Search assets by name or type...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200'
              />
            </div>

            <div className='flex gap-2'>
              <div className='relative'>
                <select
                  value={fileTypeFilter}
                  onChange={e =>
                    setFileTypeFilter(e.target.value as FileTypeFilter)
                  }
                  className='px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 appearance-none pr-10 text-sm'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value='all' className='py-2 px-3 hover:bg-accent'>
                    All File Types
                  </option>
                  <option value='image' className='py-2 px-3 hover:bg-accent'>
                    Images (jpg, png, gif, etc.)
                  </option>
                  <option value='pdf' className='py-2 px-3 hover:bg-accent'>
                    PDF Files
                  </option>
                  <option
                    value='notebook'
                    className='py-2 px-3 hover:bg-accent'
                  >
                    Jupyter Notebooks (ipynb)
                  </option>
                  <option
                    value='document'
                    className='py-2 px-3 hover:bg-accent'
                  >
                    Documents (doc, docx, etc.)
                  </option>
                </select>
              </div>

              <div className='relative'>
                <select
                  value={groupBy}
                  onChange={e => setGroupBy(e.target.value as GroupBy)}
                  className='px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 appearance-none pr-10 text-sm'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value='none' className='py-2 px-3 hover:bg-accent'>
                    No Grouping
                  </option>
                  <option value='type' className='py-2 px-3 hover:bg-accent'>
                    File Type
                  </option>
                  <option
                    value='references'
                    className='py-2 px-3 hover:bg-accent'
                  >
                    Usage Status
                  </option>
                  <option value='date' className='py-2 px-3 hover:bg-accent'>
                    Upload Date
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Asset List */}
          <div className='lg:col-span-2'>
            <div className='bg-card rounded-2xl border border-border/50 shadow-lg overflow-hidden'>
              <div className='p-6 border-b border-border/50'>
                <h2 className='text-xl font-semibold text-foreground flex items-center gap-2'>
                  <FileText className='w-5 h-5 text-primary' />
                  Assets ({filteredAssets.length})
                </h2>
              </div>

              <div className='max-h-[550px] overflow-y-auto'>
                {groupBy === 'none'
                  ? // Regular list without grouping
                    sortedAssets.map(asset => (
                      <AssetItem
                        key={asset._id}
                        asset={asset}
                        selectedAsset={selectedAsset}
                        setSelectedAsset={setSelectedAsset}
                        fetchAssetReferences={fetchAssetReferences}
                      />
                    ))
                  : // Grouped list
                    Object.entries(groupedAssets).map(
                      ([groupName, groupAssets]) => {
                        const isCollapsed = collapsedGroups.has(groupName);
                        return (
                          <div key={groupName}>
                            <div
                              className='px-6 py-3 bg-muted/30 border-b border-border/30 cursor-pointer hover:bg-muted/50 transition-colors'
                              onClick={() => toggleGroupCollapse(groupName)}
                            >
                              <h3 className='font-medium text-foreground flex items-center gap-2'>
                                {isCollapsed ? (
                                  <ChevronDown className='w-4 h-4 text-primary transition-transform' />
                                ) : (
                                  <ChevronUp className='w-4 h-4 text-primary transition-transform' />
                                )}
                                <Filter className='w-4 h-4 text-primary' />
                                {groupName} ({groupAssets.length})
                              </h3>
                            </div>
                            {!isCollapsed &&
                              (groupAssets as AssetWithReferences[]).map(
                                (asset: AssetWithReferences) => (
                                  <AssetItem
                                    key={asset._id}
                                    asset={asset}
                                    selectedAsset={selectedAsset}
                                    setSelectedAsset={setSelectedAsset}
                                    fetchAssetReferences={fetchAssetReferences}
                                  />
                                )
                              )}
                          </div>
                        );
                      }
                    )}

                {filteredAssets.length === 0 && (
                  <div className='p-12 text-center'>
                    <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
                      <FileText className='w-8 h-8 text-muted-foreground' />
                    </div>
                    <p className='text-muted-foreground text-lg'>
                      {searchTerm
                        ? 'No assets found matching your search.'
                        : 'No assets found'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Asset Details Panel */}
          <div className='lg:col-span-1'>
            <div className='bg-card rounded-2xl border border-border/50 shadow-lg p-6 sticky top-8'>
              {selectedAsset ? (
                <div className='space-y-6'>
                  <div className='flex items-center gap-3'>
                    {selectedAsset._type === 'sanity.imageAsset' ? (
                      <Image
                        className='w-6 h-6 text-blue-500'
                        role='img'
                        aria-label='Image asset'
                      />
                    ) : (
                      <FileText
                        className='w-6 h-6 text-orange-500'
                        role='img'
                        aria-label='Document asset'
                      />
                    )}
                    <h2 className='text-xl font-semibold text-foreground'>
                      Asset Details
                    </h2>
                  </div>

                  {/* File Information */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-foreground'>
                      File Information
                    </h3>
                    <div className='bg-muted/50 rounded-lg p-4 space-y-3 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Name:</span>
                        <span className='font-medium text-foreground'>
                          {selectedAsset.originalFilename || 'Untitled'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Type:</span>
                        <span className='font-medium text-foreground'>
                          {selectedAsset._type === 'sanity.imageAsset'
                            ? 'Image'
                            : 'File'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>
                          MIME Type:
                        </span>
                        <span className='font-medium text-foreground'>
                          {selectedAsset.mimeType || 'Unknown'}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Size:</span>
                        <span className='font-medium text-foreground'>
                          {selectedAsset.metadata?.size
                            ? formatFileSize(selectedAsset.metadata.size)
                            : 'Unknown'}
                        </span>
                      </div>
                      {selectedAsset.metadata?.dimensions && (
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>
                            Dimensions:
                          </span>
                          <span className='font-medium text-foreground'>
                            {selectedAsset.metadata.dimensions.width} ×{' '}
                            {selectedAsset.metadata.dimensions.height}
                          </span>
                        </div>
                      )}
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Created:</span>
                        <span className='font-medium text-foreground'>
                          {formatDate(selectedAsset.createdAt)}
                        </span>
                      </div>
                      {selectedAsset.url && (
                        <div className='flex justify-between items-center'>
                          <span className='text-muted-foreground'>
                            CDN URL:
                          </span>
                          <a
                            href={selectedAsset.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-muted-foreground hover:text-foreground transition-colors'
                            title={selectedAsset.url}
                          >
                            <svg
                              className='w-4 h-4'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* References */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-foreground'>References</h3>
                    {selectedAsset.references &&
                    selectedAsset.references.length > 0 ? (
                      <div className='space-y-3'>
                        {selectedAsset.references.map(
                          (ref: AssetReference, index: number) => (
                            <div
                              key={`asset-ref-${ref.courseId}-${ref.lessonId || ref.moduleTitle || index}`}
                              className='bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800'
                            >
                              <div className='space-y-1'>
                                <div className='text-xs text-green-600 dark:text-green-300 space-y-1'>
                                  <p>Course: {ref.courseTitle}</p>
                                  <p>Module: {ref.moduleTitle}</p>
                                  <p>Lesson: {ref.lessonTitle}</p>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className='bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800 text-center'>
                        <p className='text-sm text-yellow-800 dark:text-yellow-200 font-medium'>
                          No references found
                        </p>
                        <p className='text-xs text-yellow-600 dark:text-yellow-300 mt-1'>
                          This asset is not used in any lessons
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className='space-y-4'>
                    <h3 className='font-medium text-foreground'>Actions</h3>
                    <div className='flex flex-col gap-2'>
                      {selectedAsset.url && (
                        <>
                          <Button
                            onClick={() =>
                              window.open(selectedAsset.url, '_blank')
                            }
                            variant='outline'
                            className='w-full gap-2 hover:bg-accent/50'
                          >
                            <Eye className='w-4 h-4' />
                            View Asset
                          </Button>
                          <Button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = selectedAsset.url!;
                              link.download =
                                selectedAsset.originalFilename || 'download';
                              link.click();
                            }}
                            variant='outline'
                            className='w-full gap-2 hover:bg-accent/50'
                          >
                            <Download className='w-4 h-4' />
                            Download
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => {
                          const assetName =
                            selectedAsset.originalFilename || 'this asset';
                          const assetType =
                            selectedAsset._type === 'sanity.imageAsset'
                              ? 'image'
                              : 'file';
                          const refCount =
                            selectedAsset.references?.length || 0;

                          let confirmMessage = `Are you sure you want to delete "${assetName}"?\n\n`;
                          confirmMessage += `This will permanently remove the ${assetType} from Sanity CDN.\n`;

                          if (refCount > 0) {
                            confirmMessage += `WARNING: This ${assetType} is referenced by ${refCount} lesson${refCount === 1 ? '' : ''}.\n`;
                            confirmMessage += `Deleting it may break those lessons.\n\n`;
                          }

                          confirmMessage += `This action cannot be undone.`;

                          if (confirm(confirmMessage)) {
                            deleteAsset(selectedAsset._id);
                          }
                        }}
                        variant='destructive'
                        disabled={deleting === selectedAsset._id}
                        className='w-full gap-2'
                      >
                        <Trash2 className='w-4 h-4' />
                        {deleting === selectedAsset._id
                          ? 'Deleting from CDN...'
                          : 'Delete from CDN'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='text-center py-12'>
                  <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4'>
                    <FileText className='w-8 h-8 text-muted-foreground' />
                  </div>
                  <p className='text-muted-foreground font-medium'>
                    Select an asset
                  </p>
                  <p className='text-sm text-muted-foreground mt-1'>
                    Choose an asset from the list to view its details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// Separate component for asset items to keep the main component cleaner
function AssetItem({
  asset,
  selectedAsset,
  setSelectedAsset,
  fetchAssetReferences,
}: {
  asset: AssetWithReferences;
  selectedAsset: AssetWithReferences | null;
  setSelectedAsset: (asset: AssetWithReferences | null) => void;
  fetchAssetReferences: (assetId: string) => Promise<AssetReference[]>;
}) {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleAssetClick = async () => {
    setSelectedAsset(asset);
    // Fetch references when asset is selected
    if (!asset.references || asset.references.length === 0) {
      const references = await fetchAssetReferences(asset._id);
      setSelectedAsset({
        ...asset,
        references,
      });
    }
  };

  return (
    <div
      onClick={handleAssetClick}
      className={cn(
        'p-4 border-b border-border/30 cursor-pointer transition-all duration-200 hover:bg-accent/30',
        selectedAsset?._id === asset._id && 'bg-accent/50 border-primary/20'
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-3 mb-2'>
            {asset._type === 'sanity.imageAsset' ? (
              <Image
                className='w-4 h-4 text-blue-500 flex-shrink-0'
                role='img'
                aria-label='Image asset'
              />
            ) : (
              <FileText
                className='w-4 h-4 text-orange-500 flex-shrink-0'
                role='img'
                aria-label='Document asset'
              />
            )}
            <h3 className='font-medium text-foreground truncate'>
              {asset.originalFilename || 'Untitled'}
            </h3>
          </div>

          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                asset._type === 'sanity.imageAsset'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
              )}
            >
              {asset._type === 'sanity.imageAsset' ? 'Image' : 'Document'}
            </span>
            <span className='truncate'>{asset.mimeType}</span>
            {asset.metadata?.size && (
              <span className='flex-shrink-0'>
                {formatFileSize(asset.metadata.size)}
              </span>
            )}
            <span
              className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
                (asset.referenceCount || 0) > 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
              )}
            >
              {asset.referenceCount || 0} ref
              {(asset.referenceCount || 0) === 1 ? '' : 's'}
            </span>
          </div>

          {asset.metadata?.dimensions && (
            <p className='text-xs text-muted-foreground mt-1'>
              {asset.metadata.dimensions.width} ×{' '}
              {asset.metadata.dimensions.height}
            </p>
          )}
        </div>

        <div className='text-right text-xs text-muted-foreground ml-4 flex-shrink-0'>
          {formatDate(asset.createdAt)}
        </div>
      </div>
    </div>
  );
}
