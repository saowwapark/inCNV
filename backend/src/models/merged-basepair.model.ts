import { BpGroup } from './../dto/analysis/bp-group';
import { RegionBpDto } from '../dto/basepair.dto';

import { MergedBasepairDto } from '../dto/analysis/merged-basepair.dto';

export class MergedBasepairModel {
  /**
   *  Get Merged Bps of multiple samples or mulitple cnv tools
   */
  // allSortedPostion: any[] = [];

  public mergeBpGroups = (bpGroups: BpGroup[]): MergedBasepairDto[] => {
    const mergedBps: MergedBasepairDto[] = [];
    const allSortedPostion = this.sortAllPosition(bpGroups);
    for (let i = 0; i < allSortedPostion.length - 1; i++) {
      const iStart = allSortedPostion[i];
      const iEnd = allSortedPostion[i + 1];

      const namelist = this.getVariantInRange(bpGroups, iStart, iEnd);
      if (namelist.length != 0) {
        const mergedBp = new MergedBasepairDto(iStart, iEnd, namelist);
        mergedBps.push(mergedBp);
      }
    }

    this.removeContingentList(mergedBps);
    this.distinctGroupName(mergedBps);
    return mergedBps;
  };

  sortAllPosition = (bpGroups: BpGroup[]) => {
    const map: number[] = this.getMapPosition(bpGroups);
    const allposition = this.convertMapToArrayInt(map);
    const allSortedPostion = this.sortArray(allposition);
    return allSortedPostion;
  };

  distinctGroupName = (mergedBps: MergedBasepairDto[]) => {
    for (let i = 0; i < mergedBps.length; i++) {
      const mergedBp = mergedBps[i];
      let overlaps = mergedBp.overlaps;
      mergedBp.overlaps = Array.from(new Set(overlaps));
    }
  };
  getVariantInRange(
    bpGroups: BpGroup[],
    expectedStartBp: number,
    expectedEndBp: number
  ) {
    const namelist: string[] = [];
    for (const bpGroup of bpGroups) {
      const bps = bpGroup.basepairs!;
      const groupName = bpGroup.groupName!;
      for (const bp of bps) {
        if (bp.startBp <= expectedStartBp && bp.endBp >= expectedEndBp) {
          if (bp.startBp > expectedEndBp) {
            break;
          }
          namelist.push(groupName);
        }
      }
    }

    return namelist;
  }

  getMapPosition(bpGroups: BpGroup[]) {
    const map: number[] = [];
    for (const bpGroup of bpGroups) {
      const bps = bpGroup.basepairs!;
      for (const bp of bps) {
        map[bp.startBp] = 1;
        map[bp.endBp] = 1;
      }
    }
    return map;
  }

  sortArray(allkey: any[]) {
    return allkey.sort((a, b) => (a > b ? 1 : -1));
  }

  convertMapToArrayInt(map) {
    const allkey: any[] = [];
    for (const key in map) {
      allkey.push(parseInt(key));
    }
    return allkey;
  }

  removeContingentList(alloverlapped) {
    for (let i = 0; i < alloverlapped.length - 1; i++) {
      if (alloverlapped[i].end == alloverlapped[i + 1].start) {
        const iEnd = parseInt(alloverlapped[i].end) - 1;
        alloverlapped[i].end = iEnd;
      }
    }
  }
}

export const mergedBasepairModel = new MergedBasepairModel();
