import { SORT_ORDER, STUDENT_SORTABLE_FIELDS } from '../constants/index.js';

const parseSortOrder = (order) => {
  const knownSortOrders = [SORT_ORDER.ASC, SORT_ORDER.DESC];
  if (knownSortOrders.includes(order)) {
    return order;
  }

  return SORT_ORDER.ASC; // default sort order ACS
};

const parseSortBy = (sortBy) => {
  if (STUDENT_SORTABLE_FIELDS.includes(sortBy)) {
    return sortBy;
  }
  return STUDENT_SORTABLE_FIELDS[0]; // default sort by field ID
};

export const parseSortParams = (query) => {
  const sortOrder = parseSortOrder(query.sortOrder);
  const sortBy = parseSortBy(query.sortBy);

  return {
    sortOrder,
    sortBy,
  };
};
