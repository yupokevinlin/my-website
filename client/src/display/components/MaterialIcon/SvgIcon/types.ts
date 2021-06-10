export interface SvgIconData {
  path: Array<string>;
  viewBox: string;
}

export interface SvgIconDataObject {
  [name: string]: SvgIconData;
}

export const svgIconDataObject: SvgIconDataObject = {
  "ExternalLink": {
    path: [
      "M 5,5 C 3.3549904,5 2,6.3549904 2,8 v 11 c 0,1.64501 1.3549904,3 3,3 h 11 c 1.64501,0 3,-1.35499 3,-3 v -6 a 1,1 0 0 0 -1,-1 1,1 0 0 0 -1,1 v 6 c 0,0.564129 -0.435871,1 -1,1 H 5 C 4.4358706,20 4,19.564129 4,19 V 8 C 4,7.4358706 4.4358706,7 5,7 h 6 A 1,1 0 0 0 12,6 1,1 0 0 0 11,5 Z",
      "m 15,2 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 5 v 5 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 V 3 A 1.0001,1.0001 0 0 0 21,2 Z",
      "M 21.029297,2 A 1,1 0 0 0 20.292969,2.2929688 L 9.2929688,13.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140622,0 l 11,-10.9999998 a 1,1 0 0 0 0,-1.4140624 A 1,1 0 0 0 21.029297,2 Z",
    ],
    viewBox: "0 0 24 24",
  }
}
