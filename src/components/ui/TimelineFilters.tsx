import { useState } from 'react'
import { Filter, X, Code, Award, Briefcase, GraduationCap, Zap } from 'lucide-react'

interface TimelineFiltersProps {
  activeFilters: string[]
  onFilterChange: (filters: string[]) => void
  entryCounts: Record<string, number>
}

const TimelineFilters = ({ activeFilters, onFilterChange, entryCounts }: TimelineFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const filterOptions = [
    { id: 'skill', label: 'Skills', icon: Code, color: 'blue' },
    { id: 'project', label: 'Projects', icon: Award, color: 'green' },
    { id: 'experience', label: 'Experience', icon: Briefcase, color: 'orange' },
    { id: 'education', label: 'Education', icon: GraduationCap, color: 'indigo' },
    { id: 'milestone', label: 'Milestones', icon: Zap, color: 'purple' }
  ]

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(f => f !== filterId)
      : [...activeFilters, filterId]
    onFilterChange(newFilters)
  }

  const clearAllFilters = () => {
    onFilterChange([])
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      green: isActive ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
      orange: isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      indigo: isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
      purple: isActive ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="relative mb-8">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Filter size={16} />
        <span className="text-sm font-medium">Filter Timeline</span>
        {activeFilters.length > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
            {activeFilters.length}
          </span>
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-10 min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Filter by Type</h3>
            {activeFilters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X size={12} />
                Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {filterOptions.map((option) => {
              const IconComponent = option.icon
              const isActive = activeFilters.includes(option.id)
              const count = entryCounts[option.id] || 0

              return (
                <button
                  key={option.id}
                  onClick={() => toggleFilter(option.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getColorClasses(option.color, isActive)}`}
                >
                  <IconComponent size={14} />
                  <span>{option.label}</span>
                  <span className="ml-auto text-xs opacity-70">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Filters Summary */}
          {activeFilters.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Active filters:</p>
              <div className="flex flex-wrap gap-1">
                {activeFilters.map((filterId) => {
                  const option = filterOptions.find(opt => opt.id === filterId)
                  if (!option) return null

                  return (
                    <span
                      key={filterId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {option.label}
                      <button
                        onClick={() => toggleFilter(filterId)}
                        className="hover:text-gray-900"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default TimelineFilters
