import React from "react";
import Review from "../reviews/review";
import GroupRatings from "./group_ratings";
import Similar from "./similar";
import ModalButtonContainer from '../modal/modal_button_container';
import NavbarContainer from '../navbar/navbar_container'

import Sidebar from "../sidebar/sidebar";



class MovieShow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            overflow: "Show more"
        }
        this.overflowSwitch = this.overflowSwitch.bind(this)
        this.groupRedirect = this.groupRedirect.bind(this)
        this.deleteMovie = this.deleteMovie.bind(this)
    }

    componentDidMount() {
        this.props.fetchMovie(this.props.match.params.movieId)
        this.props.fetchReviews(this.props.match.params.movieId)
            
    }

    componentDidUpdate(prevProps){
        if (this.props.movie !== prevProps.movie){
            if (this.props.movie) {
                this.props.fetchGroup(this.props.movie.group_id)
            }
        }
    }

    overflowSwitch(){
        this.setState({ overflow: this.state.overflow === "Show more" ? "Show less" : "Show more" })
    }

    groupRedirect(){
        this.props.history.push(`/groups/${this.props.movie.group_id}`)
    }

    deleteMovie(){
        let groupId = this.props.movie.group_id;
        this.props.deleteMovie(this.props.movie._id).then(()=>this.props.history.push(`/groups/${groupId}`))
    }

    render() {
        if (!this.props.movie || !this.props.reviews) return null;
        if (Object.values(this.props.groups).length === 0) return null;
        let { movie, reviews, groups } = this.props
        let ourGroup = Object.values(groups).filter(group => movie.group_id === group._id)
        let reviewArr = Object.values(reviews).filter(review => review.movie_id === movie._id)
        const groupId = this.props.movie.group_id
        const members = this.props.groups[groupId].users.map(obj =>  {
            return obj._id;
        });
        let {similar_movies} = movie
        let yourReview = reviewArr.filter(review => review.reviewer._id === this.props.currentUser.id);
        return (
            <div className="movie-show-parent-div">
                {
                this.props.movie ? (
                    <Sidebar display="show" currentUser={this.props.currentUser} groups={this.props.groups[this.props.movie.group_id]} />
                ) : (
                    null
                )
                }
                
                {
                  members.includes(this.props.currentUser.id) && (yourReview.length === 0) ? (
                    <ModalButtonContainer modalType={{type:'review', movie: this.props.movie}} />
                  ) : (
                    null
                  )
                }
                <NavbarContainer />
                <div className="movie-show-dummy-div"></div>

                <div className="movie-show-main-content-div">
                    <div className="movie-show-left-content">
                        <img src={movie.poster} className="movie-show-poster" alt=""/>
                        <div onClick={this.groupRedirect} className="movie-show-back-button">Back to Group</div>
                        { 
                        this.props.currentUser.id === ourGroup[0].owner._id || this.props.currentUser.id === movie.submitter_id ?
                        <div onClick={this.deleteMovie} className="movie-show-back-button">Remove Movie</div>
                        : <div></div>
                        }
                        <div className="movie-show-similar-div">
                            <h1>Recommended Movies</h1>
                            <hr />
                            <div className="movie-show-similar-index">
                                {
                                    similar_movies.map((movie, idx) => {
                                        return <Similar  key={idx} movie={movie} />
                                    })
                                }
                            </div>

                        </div>
                    </div>
                    <div className="movie-show-right-content">
                        <div className="movie-show-right-title">
                            {
                                movie.title.length >= 50 ? (
                                    <div>
                                        <div className={this.state.overflow === "Show more" ? "movie-show-right-title" : "movie-show-none"}>
                                            <h1>{movie.title.slice(0,50)}...<span>{movie.year}</span><span id="overflow-button" onClick={this.overflowSwitch}>{this.state.overflow}</span> </h1>
                                            <hr /> 
                                        </div>
                                        <div className={this.state.overflow === "Show less" ? "movie-show-right-title" : "movie-show-none"}>
                                            <h1>{movie.title}<span>{movie.year}</span><span id="overflow-button" onClick={this.overflowSwitch}>{this.state.overflow}</span> </h1>
                                            <hr /> 
                                        </div>
                                    </div>

                                ) : (
                                        <div className="movie-show-right-title">
                                        <h1>{movie.title}<span>{movie.year}</span> </h1>
                                        <hr />
                                    </div>
                                )
                            }
                            
                        </div>
                        <div className="movie-show-movie-stats">
                            <h4>{movie.runtime}</h4>
                            <h4>{movie.genre[0]}</h4>
                            <h4>{movie.director}</h4>
                        </div>
                        <p className="movie-show-plot">{movie.plot.split("&#39;").join("'")}</p>
                        <GroupRatings reviews={reviewArr} group={ourGroup[0]} movie={this.props.movie}/>
                        <div className="movie-show-reviews">
                            {
                                reviewArr.map((review, idx )=> {
                                    return <Review key={idx} review={review} openModal={this.props.openModal} movie={this.props.movie} currentUser={this.props.currentUser} deleteReview={this.props.deleteReview}/>
                                })
                            }

                        </div>

                    </div>

                </div>
            </div>
        )
    }
}

export default MovieShow;