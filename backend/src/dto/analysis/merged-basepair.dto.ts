import { RegionBpDto } from '../basepair.dto';

export class MergedBasepairDto extends RegionBpDto {
  overlaps: string[];

  constructor(startBp: number, endBp: number, overlaps: string[]) {
    super(startBp, endBp);
    this.overlaps = overlaps;
  }
}
