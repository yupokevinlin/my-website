import React from "react";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const Skills: React.FC = () => {
  const itemImageWrapperClass = "flex flex-col items-center justify-evenly h-[23vw] w-[13vw] mx-[4vw] sm:h-[19vw] sm:w-[12vw] md:h-[16vw] md:w-[11vw] md:mx-[3vw] lg:h-[13vw] lg:w-[7.8vw] lg:mx-[2vw]";
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
          <div className="h-max w-full flex flex-row items-center justify-evenly flex-wrap">
            {items.map(([url, label]) => <React.Fragment key={label}>{renderItem(url, label)}</React.Fragment>)}
          </div>
        </div>
      </Paper>
    </>
  );

  return (
    <div className="w-full flex flex-col items-center justify-center h-max content-grid-bg">
      {renderCategory("STYLING", [["./resources/images/skills/css3.png","CSS"],["./resources/images/skills/tailwind.png","Tailwind CSS"],["./resources/images/skills/sass.svg","Sass"],["./resources/images/skills/bootstrap.png","Bootstrap"],["./resources/images/skills/mui.png","Material UI"],["./resources/images/skills/fluentui.svg","Fluent UI"]])}
      {renderCategory("FRONT END", [["./resources/images/skills/html5.png","HTML"],["./resources/images/skills/javascript.png","JavaScript"],["./resources/images/skills/typescript.png","TypeScript"],["./resources/images/skills/react.svg","React JSX"],["./resources/images/skills/next.svg","Next.js"],["./resources/images/skills/next-auth.png","NextAuth.js"],["./resources/images/skills/redux.svg","Redux"],["./resources/images/skills/redux-toolkit.svg","Redux Toolkit"],["./resources/images/skills/reduxsaga.svg","Redux Saga"],["./resources/images/skills/tanstack-query.svg","TanStack Query"],["./resources/images/skills/reactnative.png","React Native"],["./resources/images/skills/electron.png","Electron"],["./resources/images/skills/jquery.png","jQuery"],["./resources/images/skills/jest.png","Jest"],["./resources/images/skills/vitest.svg","Vitest"],["./resources/images/skills/rtl.png","React Testing Library"],["./resources/images/skills/playwright.svg","Playwright"],["./resources/images/skills/cypress.svg","Cypress"]])}
      {renderCategory("FRONT END BUILD", [["./resources/images/skills/nx.png","Nx"],["./resources/images/skills/vite.svg","Vite"],["./resources/images/skills/webpack.png","Webpack"]])}
      {renderCategory("BACK END", [["./resources/images/skills/node.png","Node.js"],["./resources/images/skills/express.svg","Express"],["./resources/images/skills/springboot.png","Spring Boot"],["./resources/images/skills/wildfly.svg","WildFly"],["./resources/images/skills/graphql.png","GraphQL"]])}
      {renderCategory("DATABASE", [["./resources/images/skills/mongodb.svg","MongoDB"],["./resources/images/skills/postgres.png","PostgreSQL"],["./resources/images/skills/mssql.svg","Microsoft SQL Server"]])}
      {renderCategory("DEVOPS", [["./resources/images/skills/git.png","Git"],["./resources/images/skills/github.png","GitHub"],["./resources/images/skills/kubernetes.svg","Kubernetes"],["./resources/images/skills/openshift.png","OpenShift"],["./resources/images/skills/jenkins.png","Jenkins"],["./resources/images/skills/docker.svg","Docker"],["./resources/images/skills/nginx.png","Nginx"]])}
      {renderCategory("AI & MACHINE LEARNING", [["./resources/images/skills/claude.svg","Claude Code"],["./resources/images/skills/mcp.svg","MCP"],["./resources/images/skills/copilot.svg","GitHub Copilot"],["./resources/images/skills/openai.svg","OpenAI API"],["./resources/images/skills/gemini.svg","Gemini API"],["./resources/images/skills/ollama.svg","Ollama"],["./resources/images/skills/huggingface.svg","Hugging Face"],["./resources/images/skills/tensorflow.svg","TensorFlow"],["./resources/images/skills/opencv.svg","OpenCV"]])}
      {renderCategory("OTHER LANGUAGES", [["./resources/images/skills/java.svg","Java"],["./resources/images/skills/csharp.png","C#"],["./resources/images/skills/python.png","Python"]])}
      <div className="paper-spacer"/>
    </div>
  );
};

export default Skills;

