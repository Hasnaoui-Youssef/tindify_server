export type SongQueryDTO = {
  created : string;
  count : number;
  offset : number;
  recordings : { id : string }[];
}
