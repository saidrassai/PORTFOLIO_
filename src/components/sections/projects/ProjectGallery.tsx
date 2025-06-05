import React, { useState } from 'react'
import ProjectSliderEnhanced from './ProjectSliderEnhanced'
import './ProjectGallery.scss'

interface ProjectData {
  title: string
  status: string
  description?: string
  image: string
}

interface ProjectGalleryProps {
  projects: ProjectData[]
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ projects }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const openFullscreen = () => setIsFullscreen(true)
  const closeFullscreen = () => setIsFullscreen(false)

  return (
    <>
      {/* Gallery trigger button */}
      <div className="project-gallery-trigger">
        <button 
          onClick={openFullscreen}
          className="open-gallery-btn"
        >
          <span>Experience Interactive Gallery</span>
          <div className="gallery-preview">
            {projects.slice(0, 3).map((project, index) => (
              <div 
                key={index}
                className="preview-image"
                style={{ 
                  backgroundImage: `url(${project.image})`,
                  animationDelay: `${index * 0.2}s`
                }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Fullscreen Gallery */}
      {isFullscreen && (
        <div className="fullscreen-gallery">
          <button 
            onClick={closeFullscreen}
            className="close-fullscreen"
            aria-label="Close Gallery"
          >
            ✕
          </button>
          <ProjectSliderEnhanced 
            projects={projects} 
            autoPlay={false} 
            interval={5000} 
          />
        </div>
      )}
    </>
  )
}

export default ProjectGallery
