const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

dayjs.extend((option, dayjsClass, dayjsFactory) => {
  dayjsFactory.convert = (amount, from, to) => {
    const now = dayjsFactory();
    return now.add(amount, from).diff(now, to);
  };
});

module.exports = dayjs;