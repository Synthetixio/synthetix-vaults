import { FormatTypes, Fragment, Interface, JsonFragment } from '@ethersproject/abi';

const formatHumanReadableAbi = (
  fragments: string | ReadonlyArray<Fragment | JsonFragment | string>
) => {
  const iface = new Interface(fragments);
  let hrAbi = iface.format(FormatTypes.full);
  if (typeof hrAbi === 'string') {
    hrAbi = [hrAbi];
  }
  return hrAbi;
};

export default formatHumanReadableAbi;
