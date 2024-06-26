import { Partition, PollingMode, SeekType } from 'generated-sources';
import { Option } from 'react-multi-select-component';
import compact from 'lib/functions/compact';

export function isModeOptionWithInput(value: PollingMode) {
  return (
    value !== PollingMode.TAILING &&
    value !== PollingMode.LATEST &&
    value !== PollingMode.EARLIEST
  );
}

export function isModeOffsetSelector(value: PollingMode) {
  return value === PollingMode.TO_OFFSET || value === PollingMode.FROM_OFFSET;
}

export function isLiveMode(mode?: PollingMode) {
  return mode === PollingMode.TAILING;
}

export const filterOptions = (options: Option[], filter: string) => {
  if (!filter) {
    return options;
  }
  return options.filter(
    ({ value }) => value.toString() && value.toString() === filter
  );
};

export const getOffsetFromSeekToParam = (params: URLSearchParams) => {
  if (params.get('seekType') === SeekType.OFFSET) {
    // seekTo format = ?seekTo=0::123,1::123,2::0
    const offsets = params
      .get('seekTo')
      ?.split(',')
      .map((item) => Number(item.split('::')[1]));
    return String(Math.max(...(offsets || []), 0));
  }

  return '';
};

export const getTimestampFromSeekToParam = (params: URLSearchParams) => {
  if (params.get('seekType') === SeekType.TIMESTAMP) {
    // seekTo format = ?seekTo=0::1627333200000,1::1627333200000
    const offsets = params
      .get('seekTo')
      ?.split(',')
      .map((item) => Number(item.split('::')[1]));
    return new Date(Math.max(...(offsets || []), 0));
  }

  return null;
};

export const getSelectedPartitionsFromSeekToParam = (
  params: URLSearchParams,
  partitions: Partition[]
) => {
  const seekTo = params.get('seekTo');

  if (seekTo) {
    const selectedPartitionIds = seekTo
      .split(',')
      .map((item) => Number(item.split('::')[0]));

    // TODO fix this for now
    return compact(
      partitions.map(({ partition }) => {
        if (selectedPartitionIds?.includes(partition)) {
          return {
            value: partition,
            label: `Partition #${partition.toString()}`,
          };
        }

        return undefined;
      })
    );
  }

  return partitions.map(({ partition }) => ({
    value: partition,
    label: `Partition #${partition.toString()}`,
  }));
};

export const ADD_FILTER_ID = 'ADD_FILTER';

export function isEditingFilterMode(filterId?: string) {
  return filterId !== ADD_FILTER_ID;
}
