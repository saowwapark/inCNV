import { RegionBpDto } from './../basepair.dto';

export class BpGroup {
  groupName: string;
  basepairs: RegionBpDto[];
  constructor(groupName?: string, basepairs?: RegionBpDto[]) {
    this.groupName = groupName || '';
    this.basepairs = basepairs || [];
  }
}
