import ReactPaginate from 'react-paginate';
import css from './ReactPaginate.module.css';

interface ReactPaginateProps {
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ totalPages, page, onPageChange }: ReactPaginateProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}