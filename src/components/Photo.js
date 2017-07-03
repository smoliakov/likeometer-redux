import React from 'react'
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";

const Photo = ({ photo, isLoaded, imageSrc }) => {
	const imageStyle = { backgroundImage: `url(${imageSrc})` };
	const userLikes = photo.likes.user_likes ? 'fa-heart' : 'fa-heart-o';
	const isLoadedClass = isLoaded ? 'is-loaded' : '';

	return (
		<div className="photo">
			<Link className="wrap" to={`/photo${photo.owner_id}_${photo.id}`}>
				<div className="thumb">
					<div className={`image ${isLoadedClass}`} style={imageStyle}/>
				</div>
				<div className="counters">
					<div className="likes">
						<i className={`fa ${userLikes}`} aria-hidden="true"/>
						{photo.likes.count}
					</div>
					{photo.comments.count > 0 &&
					<div className="comments">
						<i className="fa fa-comment-o" aria-hidden="true"/>
						{photo.comments.count}
					</div>}
				</div>
			</Link>
		</div>
	);
};

Photo.propTypes = {
	photo: PropTypes.object.isRequired,
	isLoaded: PropTypes.bool.isRequired,
};
Photo.defaultProps = {};

export default Photo;