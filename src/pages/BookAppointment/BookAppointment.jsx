import { useState } from 'react'
import AppointmentForm, { STEPS, StepIcon } from '../../components/AppointmentForm/AppointmentForm'
import './BookAppointment.css'

function BookAppointment() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div className="booking-page section-container">
      <div className="section-header booking-header">
        <h1 className="booking-title">
          BOOK YOUR <span className="title-accent">APPOINTMENT</span>
        </h1>
        <p className="booking-subtitle">Schedule your car service in just a few simple steps</p>
      </div>

      <div className="step-indicator" role="list" aria-label="Booking progress">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          return (
            <div key={step.id} className="step-item" role="listitem">
              <div
                className={`step-circle ${isActive ? 'step-active' : ''} ${isCompleted ? 'step-completed' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <StepIcon name={step.icon} />
              </div>
              <span className={`step-label ${isActive ? 'step-label-active' : ''}`}>
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`step-connector ${isCompleted ? 'step-connector-active' : ''}`}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="booking-content">
        <div className="booking-form-wrapper booking-form-full">
          <AppointmentForm currentStep={currentStep} setCurrentStep={setCurrentStep} />
        </div>
      </div>
    </div>
  )
}

export default BookAppointment
