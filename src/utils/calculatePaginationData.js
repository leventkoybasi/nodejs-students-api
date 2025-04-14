export const calculatePaginationData = (total, page, perPage) => {
  const totalCount = total;
  const totalPages = Math.ceil(totalCount / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  return {
    currentPage: page,
    perPage,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
