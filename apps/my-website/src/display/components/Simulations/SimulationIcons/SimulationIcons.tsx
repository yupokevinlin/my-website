import React from "react";
import SvgIcon, { SvgIconProps } from "@/components/SvgIcon";

// Material icons (Apache 2.0) plus two simple drawn icons for the simulations.

export const AppsIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
  </SvgIcon>
);

export const HomeIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </SvgIcon>
);

/** A black hole: dark disc with a tilted accretion ring. */
export const BlackHoleIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="5"/>
    <ellipse cx="12" cy="12" rx="10.5" ry="3.6" fill="none" stroke="currentColor" strokeWidth="1.8" transform="rotate(-18 12 12)"/>
  </SvgIcon>
);

/** A wormhole: nested rings narrowing into a tunnel. */
export const WormholeIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="12" cy="12" rx="10" ry="9"/>
      <ellipse cx="13" cy="12" rx="6" ry="5.4"/>
      <ellipse cx="13.8" cy="12" rx="2.6" ry="2.3"/>
    </g>
  </SvgIcon>
);

export const SpeedIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/>
  </SvgIcon>
);

export const PauseIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </SvgIcon>
);

export const PlayIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M8 5v14l11-7z"/>
  </SvgIcon>
);

export const InfoIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
  </SvgIcon>
);

export const FullscreenIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
  </SvgIcon>
);

export const CameraIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <circle cx="12" cy="12" r="3.2"/>
    <path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </SvgIcon>
);

export const TuneIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/>
  </SvgIcon>
);

export const ExpandMoreIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
  </SvgIcon>
);

export const MenuIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
  </SvgIcon>
);
