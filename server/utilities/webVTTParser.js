const _ = require('lodash');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
momentDurationFormatSetup(moment);

class ParserError extends Error {
  constructor(message, error) {
    super();
    this.message = message;
    this.error = error;
  }
}

const formatTimeStamp = (time) => {
  return moment.duration(time, 'seconds').format('hh:mm:ss.SSS', { trim: false });
};

const computeSeconds = (h, m, s, f) => {
  return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (f | 0) / 1000;
};

const parseTimeStamp = (input) => {
  let m = input.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);

  if (!m) return null;

  if (m[3]) return computeSeconds(m[1], m[2], m[3].replace(':', ''), m[4]);
  else if (m[1] > 59) return computeSeconds(m[1], m[2], 0, m[4]);
  else return computeSeconds(0, m[1], m[2], m[4]);
};

const processCue = (cue, offset) => {
  if (!cue || typeof cue !== 'string') return null;

  let lines = cue.split('\n'); /* ->
    [
      1,
      00:00:18.700 --> 00:00:21.500,
      this blade has a dark past.
    ]
  */

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('-->')) {
      let [startTime, endTime] = lines[i].split('-->');
      startTime = parseTimeStamp(startTime.trim());
      endTime = parseTimeStamp(endTime.trim());
  
      if ((endTime + offset) < 0) return null;
      startTime += offset;
      endTime += offset;
  
      lines[i] = `${formatTimeStamp(startTime)} --> ${formatTimeStamp(endTime)}`;
      return lines.join('\n');
    }
  }

  return cue;
};

const processCues = (cues, offset) => {
  return _.map(cues, (cue) => processCue(cue, offset));
};

const join = (arr, sep) => {
  let output = '';

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== null || arr[i] !== undefined || arr[i] !== '') {
      output += (arr[i] + sep);
    }
  }

  return output + arr[arr.length - 1];
};

const parse = (input, offset) => {
  if (typeof input !== 'string') throw new ParserError('Input must be a string');

  if (typeof offset !== 'number') throw new ParserError('Offset must be a number');

  input = input.replace(/\r\n/g, '\n');
  input = input.replace(/\r/g, '\n');

  let cues = [];
  let parts = input.split('\n\n');
  let header = parts[0];
  let headerParts = header.split('\n');

  if (!header.startsWith('WEBVTT')) throw new ParserError('Must start with WEBVTT');

  if (parts.length < 1) return cues;

  if (headerParts.length > 1 && headerParts[1] === '') throw new ParserError('No blank line after signature');

  cues = processCues(parts, offset);

  return join(cues, '\n\n');
};

module.exports = parse;