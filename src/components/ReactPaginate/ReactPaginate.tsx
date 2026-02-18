import ReactPaginate from 'react-paginate';
import css from './ReactPaginate.module.css';

interface ReactPaginateProps {
  pageCount: number;
  onPageChange: (selected: { selected: number }) => void;
  forcePage: number;
}

export default function Pagination({ pageCount, onPageChange, forcePage }: ReactPaginateProps) {
  return (
    <ReactPaginate
      pageCount={pageCount}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={onPageChange}
      forcePage={forcePage}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}