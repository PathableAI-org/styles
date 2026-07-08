export default {
  title: 'Components/Navigation/Pagination',
  tags: ['autodocs'],
};

export const Default = {
  render: () => `
<nav class="pathable-pagination" aria-label="Pagination">
  <ul class="pathable-pagination__list">
    <li class="pathable-pagination__item pathable-pagination__arrow">
      <a class="pathable-pagination__link" href="#previous" aria-label="Previous page">
        <span class="pathable-sr-only">Previous page</span>
      </a>
    </li>
    <li class="pathable-pagination__item">
      <a class="pathable-pagination__link" href="#1" aria-label="Page 1">1</a>
    </li>
    <li class="pathable-pagination__item">
      <a class="pathable-pagination__link" href="#2" aria-label="Page 2">2</a>
    </li>
    <li class="pathable-pagination__item">
      <a class="pathable-pagination__link" href="#3" aria-label="Page 3">3</a>
    </li>
    <li class="pathable-pagination__item">
      <a class="pathable-pagination__link" href="#4" aria-label="Page 4">4</a>
    </li>
    <li class="pathable-pagination__item pathable-pagination__overflow" aria-label="Ellipsis indicating additional pages" role="presentation">
      <span>&hellip;</span>
    </li>
    <li class="pathable-pagination__item">
      <a class="pathable-pagination__link" href="#10" aria-label="Page 10">10</a>
    </li>
    <li class="pathable-pagination__item pathable-pagination__arrow">
      <a class="pathable-pagination__link" href="#next" aria-label="Next page">
        <span class="pathable-sr-only">Next page</span>
      </a>
    </li>
  </ul>
</nav>
  `,
};