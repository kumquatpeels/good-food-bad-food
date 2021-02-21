import React, { Component } from 'react'
import styled from 'styled-components'
import dateFormatter from './Date-Formatter'
import EnterMeal from './Enter-Meal'
import EnterResult from './Enter-Result'
import TodaysMealItem from './Todays-Meal-Item'

class TodaysMeals extends Component {
	state = {
	  isLoading: true,
	  list: [],
	  listLoaded: false,
	  todaysMeals: [],
	  breakfast: [],
	  lunch: [],
	  dinner: [],
	  snacks: [],
	  breakfastReady: false,
	  lunchReady: false,
	  dinnerReady: false,
	  snacksReady: false,
	  enterModalDisplayed: false,
	  enteringFor: '',
	  resultModalDisplayed: false,
	  resultFor: '',
	  breakfastReaction: ''
	}

	componentDidMount() {

	  fetch('/api/list')
	    .then(response => response.json())
	    .then(result => {
	      const today = new Date()
	      const todaysDate = dateFormatter(today)

	      const todaysMeals = result.filter(x => {
	        const eatenAtDate = new Date(x.eatenAt)
	        const eatenAt = dateFormatter(eatenAtDate)

	        return eatenAt === todaysDate
	      })

	      const breakfast = todaysMeals.filter(x => x.mealtime === 'breakfast')
	      const lunch = todaysMeals.filter(x => x.mealtime === 'lunch')
	      const dinner = todaysMeals.filter(x => x.mealtime === 'dinner')
	      const snacks = todaysMeals.filter(x => x.mealtime === 'snacks')

	      if (breakfast.length > 0) {
	        this.setState({
	          breakfastReady: true,
	          breakfast: breakfast[0]
	        })
	      }
	      if (lunch.length > 0) {
	        this.setState({
	          lunchReady: true,
	          lunch: lunch[0]
	        })
	      }
	      if (dinner.length > 0) {
	        this.setState({
	          dinnerReady: true,
	          dinner: dinner[0]
	        })
	      }
	      if (snacks.length > 0) {
	        this.setState({
	          snacksReady: true,
	          snacks: snacks[0]
	        })
	      }

	      this.setState({
	        isLoading: false,
	        list: result,
	        listLoaded: true,
	        todaysMeals: todaysMeals
	      })
	    })

	}

	handleClick = (action, parameter) => {
	  if (action === 'enter') {
	    this.setState({
	      enterModalDisplayed: true,
	      enteringFor: parameter
	    })
	  } else if (action === 'return') {
	    this.setState({
	      resultModalDisplayed: false,
	      resultFor: '',
	      enteringFor: '',
	      enterModalDisplayed: false
	    })
	  } else if (action === 'edit') {
	    this.setState({
	      resultModalDisplayed: true,
	      resultFor: parameter
	    })
	  }
	}

	addFood = (food, mealtime) => {
	  const data = {
	    meal: food,
	    mealtime
	  }
	  fetch('/api/enter', {
	    method: 'POST',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(data)
	  })
	    .then(response => response.json())
	    .then(result => {
	      const ready = `${mealtime}Ready`
	      this.setState({
	        [mealtime]: result.rows[0],
	        [ready]: true
	      })
	    })
	}

	addResult = (food, result) => {
	  const mealId = food.mealId
	  let report
	  if (result === 'upVote') report = 3
	  else if (result === 'downVote') report = 1

	  const mealResult = {
	    mealId, report
	  }
	  fetch(`/api/rate/${mealId}`, {
	    method: 'PATCH',
	    headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(mealResult)
	  })
	    .then(response => response.json())
	    .then(data => {
	      const listCopy = [...this.state.list]
	      for (let i = 0; i < listCopy.length; i++) {
	      	if (listCopy[i].mealId === mealId) {
	          listCopy[i].report = report
	          this.setState({
	            list: listCopy,
	            resultModalDisplayed: false,
	            resultsFor: ''
	          })
	        }
	      }
	    })
	}

	render() {
	  const resFor = this.state.resultFor
	  const foodItems = this.state.[resFor]
	  return (
	    <Container>
	      {
	        this.state.breakfastReady
	          ? <TodaysMealItem
	            food={ this.state.breakfast }
	            mealtime='breakfast'
	            handleClick={ this.handleClick }
	          />
	          : <button
	            onClick={ () => this.handleClick('enter', 'breakfast') }
	            className='meal mealTime'>Breakfast</button>
	      }
	      {
	        this.state.lunchReady
	          ? <TodaysMealItem
	            food={ this.state.lunch }
	            mealtime='lunch'
	            handleClick={ this.handleClick }
	          />
	          : <button
	            onClick={ () => this.handleClick('enter', 'lunch') }
	            className='meal mealTime'>Lunch</button>
	      }
	      {
	        this.state.dinnerReady
	          ? <TodaysMealItem
	            food={ this.state.dinner }
	            mealtime='dinner'
	            handleClick={ this.handleClick }
	          />
	          : <button
	            onClick={ () => this.handleClick('enter', 'dinner') }
	            className='meal mealTime'>Dinner</button>
	      }
	      {
	        this.state.snacksReady
	          ? <TodaysMealItem
	            food={ this.state.snacks }
	            mealtime='snacks'
	            handleClick={ this.handleClick }
	          />
	          : <button
	            onClick={ () => this.handleClick('enter', 'snacks') }
	            className='meal mealTime'>Snacks</button>
	      }
	      {
	        this.state.enterModalDisplayed &&
	          <EnterMeal
	            mealtime={ this.state.enteringFor }
	            return={ this.handleClick }
	            addFood={ this.addFood }
	          />
	      }
	      {
	        this.state.resultModalDisplayed &&
					<EnterResult
					  mealtime={ this.state.resultFor }
					  foodItems={ foodItems }
					  return={ this.handleClick }
					  addResult={ this.addResult }
					/>
	      }
	    </Container>
	  )
	}
}

export default TodaysMeals

const Container = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	.meal {
		height: 25%;
		width: 100%;
		outline: none;
		border: none;
		color: var(--primary-6);
		display: flex;
		align-items: center;
	}
	.meal:nth-child(even) {
		background-color: var(--primary-1);
	}
	.meal:nth-child(odd) {
		background-color: var(--primary-0);
	}
	.mealTime {
		font-size: 1.6rem;
		font-weight: 700;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`