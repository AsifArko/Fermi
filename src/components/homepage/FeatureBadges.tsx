export function FeatureBadges() {
  const features = [
    {
      text: 'Unlimited Files',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    },
    {
      text: 'Rich Media',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    },
    {
      text: 'Responsive Design',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    },
    {
      text: 'Research-Based',
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    },
  ];

  return (
    <>
      {features.map((feature, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-medium ${feature.color}`}
        >
          {feature.text}
        </span>
      ))}
    </>
  );
}
