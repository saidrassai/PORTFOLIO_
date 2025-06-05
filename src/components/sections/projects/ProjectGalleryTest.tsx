import React from 'react'

interface ProjectData {
  title: string
  status: string
  description?: string
  image: string
}

interface ProjectGalleryTestProps {
  projects: ProjectData[]
}

const ProjectGalleryTest: React.FC<ProjectGalleryTestProps> = ({ projects }) => {
  console.log('ProjectGalleryTest rendered with projects:', projects)

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '20px',
      backgroundColor: '#23272a',
      color: 'white'
    }}>
      <h2>Gallery Test - Images Loading Check</h2>
      
      {projects.map((project, index) => (
        <div key={index} style={{ 
          marginBottom: '40px',
          border: '1px solid #333',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h3>{project.title}</h3>
          <p><strong>Status:</strong> {project.status}</p>
          <p><strong>Image URL:</strong> {project.image}</p>
          <p>{project.description}</p>
          
          <div style={{ marginTop: '20px' }}>
            <img 
              src={project.image} 
              alt={project.title}
              style={{ 
                maxWidth: '400px', 
                height: 'auto',
                border: '2px solid #555',
                display: 'block'
              }}
              onLoad={() => console.log(`Image loaded: ${project.image}`)}
              onError={(e) => console.error(`Image failed to load: ${project.image}`, e)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectGalleryTest
