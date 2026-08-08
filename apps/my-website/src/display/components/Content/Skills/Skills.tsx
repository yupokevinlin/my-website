import React from "react";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const Skills: React.FC = () => {
  const itemImageWrapperClass = "flex flex-col items-center justify-start gap-[1.5vw] h-max w-[13vw] mx-[4vw] my-[3vw] sm:gap-[1.2vw] sm:w-[12vw] sm:my-[2.5vw] md:gap-[1vw] md:w-[11vw] md:mx-[3vw] md:my-[2vw] lg:gap-[0.8vw] lg:w-[7.8vw] lg:mx-[2vw] lg:my-[1.6vw]";
  const itemImageClass        = "h-[13vw] max-w-[13vw] sm:h-[12vw] sm:max-w-[12vw] md:h-[11vw] md:max-w-[11vw] lg:h-[7.8vw] lg:max-w-[7.8vw]";
  const itemTextClass         = "content-font-body !text-center";

  const titleWrapperClass     = "flex flex-row items-center justify-start h-full w-[calc(100%-9vw)] ml-[3vw] sm:w-[calc(100%-67.5px)] sm:ml-[22.5px] md:w-[calc(100%-50px)] md:ml-[25px] lg:w-[calc(100%-82.5px)] lg:ml-[27.5px]";

  const renderItem = (url: string, label: string): React.ReactElement => (
    <div className={itemImageWrapperClass}>
      <img className={itemImageClass} src={url} alt={label}/>
      <Typography className={itemTextClass} style={{ color: "var(--secondary-dark)" }}>{label}</Typography>
    </div>
  );

  const renderCategory = (title: string, items: Array<[string, string]>): React.ReactElement => (
    <>
      <div className="paper-spacer"/>
      <Paper className="content-paper" elevation={3}>
        <div className="content-inner">
          <div className={titleWrapperClass}>
            <div className="content-font-link !cursor-default" style={{ color: "var(--primary-main)" }}>{title}</div>
          </div>
          <div className="content-divider"/>
          <div className="text-spacer"/>
          <div className="h-max w-full flex flex-row items-start justify-evenly flex-wrap">
            {items.map(([url, label]) => <React.Fragment key={label}>{renderItem(url, label)}</React.Fragment>)}
          </div>
        </div>
      </Paper>
    </>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center h-max content-grid-bg">
      {renderCategory("STYLING", [["./resources/images/skills/css3.svg","CSS"],["./resources/images/skills/tailwind.svg","Tailwind CSS"],["./resources/images/skills/sass.svg","Sass"],["./resources/images/skills/bootstrap.svg","Bootstrap"],["./resources/images/skills/mui.svg","Material UI"],["./resources/images/skills/fluentui.svg","Fluent UI"]])}
      {renderCategory("FRONT END", [["./resources/images/skills/html5.svg","HTML"],["./resources/images/skills/javascript.svg","JavaScript"],["./resources/images/skills/typescript.svg","TypeScript"],["./resources/images/skills/react.svg","React JSX"],["./resources/images/skills/next.svg","Next.js"],["./resources/images/skills/next-auth.svg","NextAuth.js"],["./resources/images/skills/redux.svg","Redux"],["./resources/images/skills/redux-toolkit.svg","Redux Toolkit"],["./resources/images/skills/reduxsaga.svg","Redux Saga"],["./resources/images/skills/tanstack-query.svg","TanStack Query"],["./resources/images/skills/reactnative.svg","React Native"],["./resources/images/skills/electron.svg","Electron"],["./resources/images/skills/jquery.svg","jQuery"],["./resources/images/skills/jest.svg","Jest"],["./resources/images/skills/vitest.svg","Vitest"],["./resources/images/skills/rtl.svg","React Testing Library"],["./resources/images/skills/playwright.svg","Playwright"],["./resources/images/skills/cypress.svg","Cypress"]])}
      {renderCategory("FRONT END BUILD", [["./resources/images/skills/nx.svg","Nx"],["./resources/images/skills/vite.svg","Vite"],["./resources/images/skills/webpack.svg","Webpack"]])}
      {renderCategory("BACK END", [["./resources/images/skills/node.svg","Node.js"],["./resources/images/skills/express.svg","Express"],["./resources/images/skills/springboot.svg","Spring Boot"],["./resources/images/skills/wildfly.svg","WildFly"],["./resources/images/skills/graphql.svg","GraphQL"]])}
      {renderCategory("DATABASE", [["./resources/images/skills/mongodb.svg","MongoDB"],["./resources/images/skills/postgres.svg","PostgreSQL"],["./resources/images/skills/mssql.svg","Microsoft SQL Server"]])}
      {renderCategory("DEVOPS", [["./resources/images/skills/git.svg","Git"],["./resources/images/skills/github.svg","GitHub"],["./resources/images/skills/kubernetes.svg","Kubernetes"],["./resources/images/skills/openshift.svg","OpenShift"],["./resources/images/skills/jenkins.svg","Jenkins"],["./resources/images/skills/docker.svg","Docker"],["./resources/images/skills/nginx.svg","Nginx"]])}
      {renderCategory("AI & MACHINE LEARNING", [["./resources/images/skills/claude.svg","Claude Code"],["./resources/images/skills/mcp.svg","MCP"],["./resources/images/skills/copilot.svg","GitHub Copilot"],["./resources/images/skills/openai.svg","OpenAI API"],["./resources/images/skills/gemini.svg","Gemini API"],["./resources/images/skills/ollama.svg","Ollama"],["./resources/images/skills/huggingface.svg","Hugging Face"],["./resources/images/skills/tensorflow.svg","TensorFlow"],["./resources/images/skills/opencv.svg","OpenCV"]])}
      {renderCategory("OTHER LANGUAGES", [["./resources/images/skills/java.svg","Java"],["./resources/images/skills/csharp.svg","C#"],["./resources/images/skills/python.svg","Python"]])}
      <div className="paper-spacer"/>
    </div>
  );
};

export default Skills;

