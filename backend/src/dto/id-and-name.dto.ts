export class IdAndNameDto {
  id: number;
  name: string;

  constructor(element) {
    this.id = element.id;
    this.name = element.name;
  }
}
