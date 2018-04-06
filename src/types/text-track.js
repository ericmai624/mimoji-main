import PropTypes from 'prop-types';

const textTrackType = {
  id: PropTypes.string,
  location: PropTypes.string,
  offset: PropTypes.number,
  label: PropTypes.string,
  encoding: PropTypes.string,
  isEnabled: PropTypes.bool
};
export default textTrackType;