import React from 'react';


const TechStack = () => {
  const { currentStyle } = useStyle();
  
  const technologies = [
    { name: 'Jira', iconUrl: '/tech-icons/jira.svg' },
    { name: 'Angular', iconUrl: '/tech-icons/angular-icon.svg' },
    { name: 'AWS', iconUrl: '/tech-icons/aws.svg' },
    { name: 'C#', iconUrl: '/tech-icons/c-sharp.svg' },
    { name: 'Docker', iconUrl: '/tech-icons/docker-icon.svg' },
    { name: '.NET', iconUrl: '/tech-icons/dotnet.svg' },
    { name: 'FastAPI', iconUrl: '/tech-icons/fastapi-icon.svg' },
    { name: 'Flask', iconUrl: '/tech-icons/flask.svg' },
    { name: 'Google Cloud', iconUrl: '/tech-icons/google-cloud.svg' },
    { name: 'Hadoop', iconUrl: '/tech-icons/hadoop.svg' },
    { name: 'Heroku', iconUrl: '/tech-icons/heroku-icon.svg' },
    { name: 'JavaScript', iconUrl: '/tech-icons/javascript.svg' },
    { name: 'Jupyter', iconUrl: '/tech-icons/jupyter.svg' },
    { name: 'Kafka', iconUrl: '/tech-icons/kafka-icon.svg' },
    { name: 'Kubernetes', iconUrl: '/tech-icons/kubernetes.svg' },
    { name: 'Matplotlib', iconUrl: '/tech-icons/matplotlib-icon.svg' },
    { name: 'Microsoft Azure', iconUrl: '/tech-icons/microsoft-azure.svg' },
    { name: 'MongoDB', iconUrl: '/tech-icons/mongodb-icon.svg' },
    { name: 'MySQL', iconUrl: '/tech-icons/mysql.svg' },
    { name: 'Next.js', iconUrl: '/tech-icons/nextjs-icon.svg' },
    { name: 'Node.js', iconUrl: '/tech-icons/nodejs.svg' },
    { name: 'Oracle', iconUrl: '/tech-icons/oracle.svg' },
    { name: 'PostgreSQL', iconUrl: '/tech-icons/postgresql.svg' },
    { name: 'Python', iconUrl: '/tech-icons/python.svg' },
    { name: 'PyTorch', iconUrl: '/tech-icons/pytorch-icon.svg' },
    { name: 'React', iconUrl: '/tech-icons/react.svg' },
    { name: 'Seaborn', iconUrl: '/tech-icons/seaborn-icon.svg' },
    { name: 'TensorFlow', iconUrl: '/tech-icons/tensorflow.svg' },
    { name: 'TypeScript', iconUrl: '/tech-icons/typescript-icon.svg' },
    { name: 'WordPress', iconUrl: '/tech-icons/wordpress-icon.svg' },
    { name: 'GraphQL', iconUrl: '/tech-icons/graphql.svg' },
    { name: 'Scikit-learn', iconUrl: '/tech-icons/scikit-learn.svg' },
  ];

  const renderMinimalistTechStack = () => (
    <div className="w-full p-6"> 
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 justify-items-center">
        {technologies.map((tech, index) => (
          <div 
            key={index}
            title={tech.name}
            className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center p-2 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md dark:hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1 group"
          >
            <OptimizedImage 
              src={tech.iconUrl} 
              alt={tech.name} 
              className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-200" 
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderGlassmorphismTechStack = () => (
    <div className="w-full p-4"> 
      <div className="flex flex-wrap gap-6 justify-center items-center">
        {technologies.map((tech, index) => (
          <div 
            key={index}
            title={tech.name}
            className="relative group cursor-pointer"
          >
            {/* Glass effect background layers */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/25 via-white/15 to-transparent backdrop-blur-xl border border-white/30 shadow-lg group-hover:shadow-2xl transition-all duration-500"></div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Inner glow effect */}
            <div className="absolute inset-0.5 rounded-[10px] bg-gradient-to-br from-white/40 via-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
            
            {/* Tech icon container */}
            <div className="relative w-14 h-14 rounded-xl backdrop-blur-2xl bg-white/10 border border-white/20 flex items-center justify-center p-2 group-hover:scale-110 group-hover:-translate-y-1 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-500">
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
              
              <OptimizedImage 
                src={tech.iconUrl} 
                alt={tech.name} 
                className="w-full h-full object-contain relative z-10 group-hover:drop-shadow-lg transition-all duration-300" 
              />
              
              {/* Floating label */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-2 py-1 rounded-md shadow-lg border border-white/30 whitespace-nowrap">
                  {tech.name}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCyberpunkTechStack = () => (
    <div className="w-full p-4"> 
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {technologies.map((tech, index) => (
          <div 
            key={index}
            title={tech.name}
            className="relative group cursor-pointer"
          >
            {/* Neon glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-lg blur-sm opacity-0 group-hover:opacity-60 transition duration-500"></div>
            
            {/* Tech icon container */}
            <div className="relative w-12 h-12 bg-black/90 backdrop-blur-md rounded-lg border border-cyan-400/30 flex items-center justify-center p-2 group-hover:border-cyan-400 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/30">
              {/* Circuit pattern overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="h-full w-full" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, cyan 0.5px, transparent 0.5px),
                                   radial-gradient(circle at 75% 75%, cyan 0.5px, transparent 0.5px)`,
                  backgroundSize: '8px 8px'
                }} />
              </div>
              
              {/* Glitch effect */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-lg bg-cyan-400/5 translate-x-0 group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-transform duration-100"></div>
              
              <OptimizedImage 
                src={tech.iconUrl} 
                alt={tech.name} 
                className="w-full h-full object-contain relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transition-all duration-300" 
              />
              
              {/* Terminal cursor */}
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-cyan-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
            </div>
            
            {/* Floating label with terminal style */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
              <div className="bg-black/90 backdrop-blur-sm border border-cyan-400/50 text-cyan-300 text-xs px-2 py-1 rounded-md shadow-lg shadow-cyan-400/20 whitespace-nowrap font-mono">
                {'>'} {tech.name}
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {currentStyle === 'minimalist' && renderMinimalistTechStack()}
      {currentStyle === 'glassmorphism' && renderGlassmorphismTechStack()}
      {currentStyle === 'cyberpunk' && renderCyberpunkTechStack()}
    </>
  );
};

export default TechStack;
