import { WritableFlagChangeset } from '../interfaces/features.interface';

interface SerializedFlagSet {
  [key: string]: {
    current: boolean;
    fictive?: boolean;
  };
}

export class FlagSetParser {
  static serialize(flags: WritableFlagChangeset): SerializedFlagSet {
    return Object.keys(flags).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          current: flags[key].current,
          fictive: flags[key].fictive
        }
      }), {});
  }

  static deserialize(serializedFlags: SerializedFlagSet): WritableFlagChangeset {
    return Object.keys(serializedFlags).reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          current: serializedFlags[key].current,
          previous: null,
          ...(serializedFlags[key].fictive ? { fictive: true } : {})
        }
      }), {});
  }
}
