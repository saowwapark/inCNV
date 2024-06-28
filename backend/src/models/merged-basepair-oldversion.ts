import { RegionBpDto } from '../dto/basepair.dto';

import { MergedBasepairDto } from '../dto/analysis/merged-basepair.dto';

import { BpGroup } from '../dto/analysis/bp-group';

export class MergedBasepairModel {
  /**
   *  Get Merged Bps of multiple samples or mulitple cnv tools
   */
  public mergeBpGroups = (bpGroups: BpGroup[]): MergedBasepairDto[] => {
    let mergedBps: MergedBasepairDto[] = [];
    for (const bpGroup of bpGroups) {
      mergedBps = this.mergeBps(mergedBps, bpGroup);
    }
    return mergedBps;
  };

  /**
   *  Merge basepairs
   */
  private mergeBps = (mergedBps: MergedBasepairDto[], bpGroup: BpGroup) => {
    const groupName = bpGroup.groupName!;
    let bps = bpGroup.basepairs!;
    let updatedBps = [...bps];
    let clonedMergedBps: MergedBasepairDto[] = []; // need to deep cloned

    for (const mergedBp of mergedBps) {
      clonedMergedBps.push({ ...mergedBp });
    }

    let finalResults: MergedBasepairDto[] = [];
    if (mergedBps && mergedBps.length === 0) {
      // First bps
      for (const bp of bps) {
        const mergedBp = new MergedBasepairDto(bp.startBp, bp.endBp, [
          groupName
        ]);
        mergedBps.push(mergedBp);
      }
      return mergedBps;
    } else {
      // each old-merged basepair compare to current cnv tool
      let mIndex = 0;
      while (mIndex < mergedBps.length) {
        let mergedBp = mergedBps[mIndex];
        let branchBps: MergedBasepairDto[] = [];

        // each basepair of this new group
        let bIndex = 0;
        while (bIndex < bps.length) {
          const bp = bps[bIndex];

          if (bp.startBp === 13668883) {
            console.log('This is it.');
          }
          // ignore cnvToolBp on right side of mergedBp
          if (bp.startBp - mergedBp.endBp > 0) break;

          // overlap
          if (bp.endBp - mergedBp.startBp >= 0) {
            const diffEnd = bp.endBp - mergedBp.endBp;
            if (diffEnd <= 0) {
              const results = this.getOverlapNotOverMergedBp(
                mergedBp,
                bp,
                groupName
              );
              if (results) {
                branchBps = branchBps.concat(results);
                mergedBp.startBp = bp.endBp + 1;
                // go to next basepair region
                bIndex++;

                // remove used region for the next merged while loop
                updatedBps.splice(updatedBps.indexOf(bp), 1);
              }
            } else {
              const results = this.getOverlapOverMergedBp(
                mergedBp,
                bp,
                groupName
              );
              if (results) {
                // change cnvToolBp used
                bp.startBp = mergedBp.endBp + 1;
                branchBps = branchBps.concat(results);

                const newIndex = updatedBps.indexOf(bp);
                updatedBps[newIndex].startBp = mergedBp.endBp + 1;
              }
            }
          }
          // not overlap
          else {
            const result = new MergedBasepairDto(bp.startBp, bp.endBp, [
              groupName
            ]);
            branchBps.push(result);

            // remove used cnvToolBp
            updatedBps.splice(updatedBps.indexOf(bp), 1);

            bIndex++;
          }
        }

        // update input bps for next while loop
        bps = updatedBps;

        // have bps
        if (branchBps.length > 0) {
          // mergedBp not be used up
          if (clonedMergedBps[mIndex].startBp !== mergedBp.startBp) {
            branchBps.push(mergedBp);
          }

          finalResults = finalResults.concat(branchBps);
          mIndex++;
        } else if (bps.length === 0 && branchBps.length === 0) {
          // have mergedBp but don't have bps

          finalResults.push(mergedBp);
          mIndex++;
        } else {
          mIndex++;
        }
      }
    }
    return finalResults;
  };

  // diffEnd > 0
  private getOverlapOverMergedBp = (
    m: MergedBasepairDto,
    t: RegionBpDto,
    name: string
  ): MergedBasepairDto[] | undefined => {
    // order of result is significant (basepair orders by ascending)
    let results: MergedBasepairDto[] | undefined = undefined;
    const diffStart = t.startBp - m.startBp;
    const overlaps = [...m.overlaps];
    if (diffStart === 0) {
      const r1 = new MergedBasepairDto(m.startBp, m.endBp, [...overlaps, name]);
      results = [r1];
    } else if (diffStart < 0) {
      const r1 = new MergedBasepairDto(t.startBp, m.startBp - 1, [name]);
      const r2 = new MergedBasepairDto(m.startBp, m.endBp, [...overlaps, name]);
      results = [r1, r2];
    } else {
      const r1 = new MergedBasepairDto(m.startBp, t.startBp - 1, overlaps);
      const r2 = new MergedBasepairDto(t.startBp, m.endBp, [...overlaps, name]);
      results = [r1, r2];
    }
    return results;
  };

  // tool cnv not over merged cnv -> remove T
  // diffEnd <= 0
  private getOverlapNotOverMergedBp = (
    m: MergedBasepairDto,
    t: RegionBpDto,
    name: string
  ): MergedBasepairDto[] | undefined => {
    // order of result is significant (basepair orders by ascending)
    let results: MergedBasepairDto[] | undefined = undefined;
    const diffStart = t.startBp - m.startBp;
    const diffEnd = t.endBp - m.endBp;
    const overlaps = [...m.overlaps];
    // M       -----------
    // T ----------
    if (diffStart < 0 && diffEnd < 0) {
      console.log('condition 1');
      const r1 = new MergedBasepairDto(t.startBp, m.startBp - 1, [name]);
      const r2 = new MergedBasepairDto(m.startBp, t.endBp, [...overlaps, name]);
      results = [r1, r2];
    }

    // M ------------
    // T -----
    else if (diffStart === 0 && diffEnd < 0) {
      console.log('condition 2');
      const r1 = new MergedBasepairDto(t.startBp, t.endBp, [...overlaps, name]);
      results = [r1];
    }

    // M -------------
    // T        ------
    else if (diffStart > 0 && diffEnd === 0) {
      console.log('condition 3');
      const r1 = new MergedBasepairDto(m.startBp, t.startBp - 1, overlaps);
      const r2 = new MergedBasepairDto(t.startBp, t.endBp, [...overlaps, name]);
      results = [r1, r2];
    }
    // M --------------
    // T --------------
    else if (diffStart === 0 && diffEnd === 0) {
      console.log('condition 4');
      const r1 = new MergedBasepairDto(m.startBp, m.endBp, [...overlaps, name]);
      results = [r1];
    }

    // M --------------
    // T    ------
    else if (diffStart > 0 && diffEnd < 0) {
      console.log('condition 5');
      const r1 = new MergedBasepairDto(m.startBp, t.startBp - 1, overlaps);
      const r2 = new MergedBasepairDto(t.startBp, t.endBp, [...overlaps, name]);
      results = [r1, r2];
    }

    // M        --------
    // T ---------------
    else if (diffStart < 0 && diffEnd === 0) {
      console.log('condition 6');
      const r1 = new MergedBasepairDto(t.startBp, m.startBp - 1, [name]);
      const r2 = new MergedBasepairDto(m.startBp, m.endBp, [...overlaps, name]);
      results = [r1, r2];
    }
    return results;
  };
}

export const mergedBasepairModel = new MergedBasepairModel();
