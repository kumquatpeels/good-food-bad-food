
import React from 'react';
import SeeIngredients from './see-ingredients';

export default class RateMeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meal: [],
      mealName: ''
    };
    this.handleRatingClick = this.handleRatingClick.bind(this);
  }

  componentDidMount() {
    const mealId = this.props.match.params.mealId;
    fetch(`/api/rate/${mealId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ mealName: data });
      })
      .catch(err => {
        alert('Error: ', err);
      });
  }

  handleRatingClick() {
    const eventText = event.target.text;
    let reportNumber = null;
    const mealId = this.props.match.params.mealId;
    let ratingImage = null;

    if (eventText === 'Good') {
      reportNumber = 3;
      ratingImage = '/images/happyFace.jpg';
    } else if (eventText === 'Ok') {
      reportNumber = 2;
      ratingImage = '/images/neutralFace.jpg';
    } else if (eventText === 'Bad') {
      reportNumber = 1;
      ratingImage = '/images/badFace.jpg';
    }

    const dataToSend = { mealId: mealId, report: reportNumber, image: ratingImage };
    fetch('/api/rate/mealId', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })

      .then(response => {
        return response.json();
      })
      .then(data => {
        this.props.history.push('/entereffects');
      })
      .catch(err => {
        alert('Error: ', err);
      });
  }

  render() {
    const mealName = [this.state.mealName.name];
    if (!this.state.meal) {
      return <div>LOADING...</div>;
    } else {
      return (
        <div className="container d-flex flex-column">
          <div className="row">
            <div className="d-flex flex-column justify-content-center">
              <h1 className="header mt-3 ml-4">
                <span>Choose Effect</span>
              </h1>
              <p className="chooseEffectLabel mt-2 ml-4">How did it make you feel?</p>
            </div>
          </div>
          <div className="chooseEffectBox mt-2 ml-2">
            <div className="text-center">{mealName}</div>
            <div className="chooseEffectFaces d-flex flex-column">
              <div>
                <a href="#" onClick={this.handleRatingClick}>Good
                  <img src='/images/happyFace.jpg'></img>
                </a>
              </div>
              <div>
                <a href="#" onClick={this.handleRatingClick}>Ok
                  <img src='/images/neutralFace.jpg'></img>
                </a>
              </div>
              <div>
                <a href="#" onClick={this.handleRatingClick}>Bad
                  <img src='/images/badFace.jpg'></img>
                </a>
              </div>
            </div>
          </div>
          <div className="ingredients mt-3 mx-auto">
            <SeeIngredients mealId={this.props.match.params.mealId} />
          </div>
        </div>
      );
    }
  }
}