import PropTypes from 'prop-types';

const fileBrowserType = {
  isVisible: PropTypes.bool,
  directory: PropTypes.object,
  content: PropTypes.array,
  displayedContent: PropTypes.array,
  hasError: PropTypes.bool
};

export default fileBrowserType;