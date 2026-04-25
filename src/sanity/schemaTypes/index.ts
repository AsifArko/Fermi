import { type SchemaTypeDefinition } from 'sanity';

import { blockContent } from './blockContent';
import { categoryType } from './categoryType';
import { codeType } from './codeType';
import { courseType } from './courseType';
import { enrollmentType } from './enrollmentType';
import errorLog from './errorLog';
import { instructorType } from './instructorType';
import { lessonCompletionType } from './lessonCompletionType';
import { lessonType } from './lessonType';
import { moduleType } from './moduleType';
import pageView from './pageView';
import performanceMetric from './performanceMetric';
import { studentType } from './studentType';
import systemMetric from './systemMetric';
import userEvent from './userEvent';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContent,
    categoryType,
    codeType,
    courseType,
    enrollmentType,
    errorLog,
    instructorType,
    lessonCompletionType,
    lessonType,
    moduleType,
    pageView,
    performanceMetric,
    studentType,
    systemMetric,
    userEvent,
  ],
};
