declare module "join-js" {
  export type ResultMap = {
    mapId: string;
    createNew?: () => any;
    idProperty?: string | { name: string, colmun: string } | (string | { name: string, colmun: string })[];
    properties?: (string | {
      name: string;
      colmun: string;
    })[];
    associations?: {
      name: string;
      mapId: string;
      columnPrefix?: string;
    }[];
    collections?: {
      name: string;
      mapId: string;
      columnPrefix?: string;
    }[];
  };
  const JoinJs: {
    map(resultSet: any[], maps: ResultMap[], mapId: string, columnPrefix?: string): any;
    mapOne(resultSet: any[], maps: ResultMap[], mapId: string, columnPrefix?: string, isRequired?: boolean): any;
  };
  export default JoinJs;
}
