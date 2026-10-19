import React from "react";
import { Paper, Typography } from "@/components";

const About: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-max content-grid-bg">
      <div className="paper-spacer"/>
      <Paper className="content-paper" elevation={3}>
        <div className="content-inner">
          <Typography
            className="content-font-intro !border-l-solid"
            align="left"
            style={{ color: "var(--primary-main)", borderLeftColor: "var(--primary-main)", borderLeftStyle: "solid" }}
          >
            Solutions-driven full stack developer with a passion for designing beautiful and intuitive UIs.
          </Typography>
          <div className="text-spacer"/><div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-body" align="left" style={{ color: "var(--secondary-dark)" }}>
            Hi! I am Kevin Lin, a full stack developer based in Vancouver, Canada. My professional journey has taken me on many twists and turns. From modeling reactions as a chemist, automating excel sheets at a trading company, to working now as a full stack developer, I am always looking for better and more efficient ways of doing things.
          </Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-body" align="left" style={{ color: "var(--secondary-dark)" }}>
            As a full stack developer, I enjoy using my solutions-driven work ethic, my incessant love for building things, and my unquenchable thirst of learning new things to make a difference. That is why I am excited to make a big impact at a high growth company.
          </Typography>
        </div>
      </Paper>
      <div className="paper-spacer"/>
    </div>
  );
};

export default About;

