import { css } from '@emotion/react';

export default css`
  .react-datepicker {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      sans-serif;
    overflow: hidden;
  }

  .react-datepicker__navigation--next--with-time:not(
      .react-datepicker__navigation--next--with-today-button
    ) {
    right: 90px;
  }

  .react-datepicker__navigation--previous,
  .react-datepicker__navigation--next {
    height: 8px;
  }

  .react-datepicker__navigation--previous {
    border-right-color: #cbd5e0;

    &:hover {
      border-right-color: #a0aec0;
    }
  }

  .react-datepicker__navigation--next {
    border-left-color: #cbd5e0;

    &:hover {
      border-left-color: #a0aec0;
    }
  }

  .react-datepicker-wrapper,
  .react-datepicker__input-container {
    display: block;
  }

  .react-datepicker__header {
    border-radius: 0;
    background: #f7fafc;
  }

  .react-datepicker,
  .react-datepicker__header,
  .react-datepicker__time-container {
    border-color: #e2e8f0;
  }

  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: inherit;
    font-weight: 600;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    margin: 0 1px 0 0;
    height: auto;
    padding: 7px 10px;

    &:hover {
      background: #edf2f7;
    }
  }

  .react-datepicker__day:hover {
    background: #edf2f7;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background: #3182ce;
    font-weight: normal;

    &:hover {
      background: #2a69ac;
    }
  }

  .react-dropdown-select {
    border-radius: 12px !important;
  }

  .react-dropdown-select:hover,
  .react-dropdown-select:focus-within {
    border-color: #97ffe4 !important;
  }

  .react-dropdown-select-dropdown {
    max-height: 300px !important;
    height: 300px !important;
    background: #0a1f1b !important;
    border-color: #061412 !important;
    box-shadow: 0px 0px 7px rgb(0 0 0 / 20%) !important;
    padding: 6px !important;
  }

  .date-range-item {
    padding: 6px !important;
  }

  .date-range-item:hover {
    background: #0f2e29 !important;
  }

  .rdrCalendarWrapper {
    box-sizing: border-box;
    background: transparent !important;
    color: #fff !important;
  }
  .rdrDayDisabled {
    background-color: rgb(9 32 27) !important;
  }
  .rdrMonthAndYearPickers select {
    color: #fff !important;
  }
  .rdrNextPrevButton {
    background-color: #194d44 !important;
  }
  .rdrNextPrevButton i {
    border-color: transparent transparent transparent #fff !important;
  }
  .rdrNextPrevButton.rdrPprevButton i {
    border-color: transparent #fff transparent transparent !important;
  }
  .rdrDayNumber span {
    color: #fff !important;
  }
  .rdrDayToday .rdrDayNumber span:after {
    background: #97ffe4 !important;
  }
`;
