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
            Senior full-stack and AI engineer building React, Next.js and LLM-powered products.
          </Typography>
          <div className="text-spacer"/><div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-body" align="left" style={{ color: "var(--secondary-dark)" }}>
            Hi! I'm Kevin Lin, a senior software engineer in Vancouver, Canada. At Best Buy Canada I'm tech lead of the Mobile Activation team: I won the company hackathon with one of its first AI-enhanced customer experiences, led my team's shift to AI-driven development, and led development of Best Buy Canada's design system.
          </Typography>
          <div className="text-spacer"/><div className="text-spacer"/>
          <Typography className="content-font-body" align="left" style={{ color: "var(--secondary-dark)" }}>
            My path into software started in chemistry at UBC and a stint automating spreadsheets at a trading company. Eight years into building software, I still love finding better and faster ways to do things, from shipping full-stack products to ray-tracing black holes in the browser.
          </Typography>
        </div>
      </Paper>
      <div className="paper-spacer"/>
    </div>
  );
};

export default About;

