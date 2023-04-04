// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  isLoading: 'IS_LOADING',
}

class CowinDashboard extends Component {
  state = {apiStatus: apiStatusList.initial, covidVaccinationDataList: []}

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusList.isLoading})

    const covidVaccinationDataApiUrl =
      'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(covidVaccinationDataApiUrl)

    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachItem => ({
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
          vaccineDate: eachItem.vaccine_date,
        })),
        vaccinationByAge: data.vaccination_by_age.map(eachItem => ({
          age: eachItem.age,
          count: eachItem.count,
        })),
        vaccinationByGender: data.vaccination_by_gender.map(eachItem => ({
          count: eachItem.count,
          gender: eachItem.gender,
        })),
      }
      this.setState({
        covidVaccinationDataList: updatedData,
        apiStatus: apiStatusList.success,
      })
    } else {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  renderSuccessView = () => {
    const {covidVaccinationDataList} = this.state
    console.log(covidVaccinationDataList)
    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={
            covidVaccinationDataList.last7DaysVaccination
          }
        />
        <VaccinationByGender
          vaccinationByGenderDetails={
            covidVaccinationDataList.vaccinationByGender
          }
        />
        <VaccinationByAge
          vaccinationByAgeDetails={covidVaccinationDataList.vaccinationByAge}
        />
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        className="failure-image"
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
      />
      <h1 className="failure-text">Something went wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCowinDashboard = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusList.success:
        return this.renderSuccessView()
      case apiStatusList.failure:
        return this.renderFailureView()
      case apiStatusList.isLoading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div className="website-logo-container">
          <img
            className="website-logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
          />
          <h1 className="cowin-text">Co-WIN</h1>
        </div>
        <h1 className="main-heading">CoWIN Vaccination in India</h1>

        {this.renderCowinDashboard()}
      </div>
    )
  }
}

export default CowinDashboard
