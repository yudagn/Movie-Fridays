import { connect } from 'react-redux';
import { deleteMovie, fetchMovie } from '../../actions/movie_actions';
import { deleteReview, fetchReviews } from '../../actions/review_actions';
import MovieShow from './movie_show';
import { fetchGroup } from '../../actions/group_actions';
import { openModal } from '../../actions/modal_actions';
import { withRouter } from 'react-router';

const mSTP = (state, ownProps) => ({
    movie: state.entities.movies[ownProps.match.params.movieId],
    reviews: state.entities.reviews,
    groups: state.entities.groups, 
    currentUser: state.session.user
})

const mDTP = dispatch => ({
    fetchMovie: movieId => dispatch(fetchMovie(movieId)),
    fetchReviews: movieId => dispatch(fetchReviews(movieId)),
    fetchGroup: groupId => dispatch(fetchGroup(groupId)),
    openModal: modal => dispatch(openModal(modal)),
    deleteReview: reviewId => dispatch(deleteReview(reviewId)),
    deleteMovie: movieId => dispatch(deleteMovie(movieId))
})

export default withRouter(connect(mSTP, mDTP)(MovieShow));