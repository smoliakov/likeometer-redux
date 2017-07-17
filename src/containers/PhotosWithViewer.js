import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Viewer from './Viewer'
import Photos from './Photos'
import Loader from '../components/Loader'
import { fetchAlbums } from '../actions/AlbumsActions'
import { fetchAllPhotos, fetchPhotosById } from '../actions/PhotosActions'

class PhotosWithViewer extends Component {
	constructor (props) {
		super(props);

		this.state = {
			albumId: 0,
			isFetching: true,
		}
	}

	componentDidMount () {
		this.update();
	}

	componentDidUpdate (prevProps) {
		const isSamePath = prevProps.location.pathname === this.props.location.pathname;
		if (!isSamePath) this.update();
	}

	update () {
		let { page, ownerId: owner_id, objectId } = this.props.match.params;
		const { fetchAllPhotos, fetchPhotosById, fetchAlbums } = this.props;

		if (page === 'album') {
			this.setState({ albumId: +objectId });
			const p1 = fetchAlbums({ owner_id });
			const p2 = fetchAllPhotos({ owner_id, album_id: objectId });

			if (this.state.isFetching)
				Promise.all([p1, p2])
				.then(() => this.setState({ isFetching: false }));
		}

		if (page === 'photo') {
			fetchPhotosById({ photos: `${owner_id}_${objectId}` })
			.then(([{ owner_id, album_id }]) => {
				this.setState({ albumId: album_id });
				const p1 = fetchAlbums({ owner_id });
				const p2 = fetchAllPhotos({ owner_id, album_id });

				if (this.state.isFetching)
					Promise.all([p1, p2])
					.then(() => this.setState({ isFetching: false }));
			});
		}
	}

	render () {
		const { photos, albums, isFetching } = this.props;
		const { page, ownerId, objectId } = this.props.match.params;

		const key = (page !== 'photo') ?
			`${ownerId}_${this.state.albumId}` :
			`${ownerId}_${objectId}`;

		const photoItems = (photos[key] || { items: [] }).items;
		const photoTotal = photos[key] ? photos[key].count : 0;
		const photoLoadedCount = photoItems.length;

		if (isFetching || !this.state.albumId || this.state.isFetching)
			return <Loader photosTotal={photoTotal} photosLoaded={photoLoadedCount}/>;

		return (
			<div>
				<Photos
					albums={albums}
					photos={photos}
					ownerId={+ownerId}
					albumId={this.state.albumId}
				/>

				{page === 'photo' && <Viewer
					albums={albums}
					photos={photos}
					albumId={this.state.albumId}
					ownerId={+ownerId}
					photoId={+objectId}
					history={this.props.history}
				/>}
			</div>
		);
	}
}

PhotosWithViewer.propTypes = {
	photos: PropTypes.object.isRequired,
	albums: PropTypes.object.isRequired,
	isFetching: PropTypes.bool.isRequired,
};
PhotosWithViewer.defaultProps = {};

const mapStateToProps = (state) => {
	const photos = state.photos.photos;
	const albums = state.albums.albums;

	const isFetching =
		state.photos.isFetching ||
		state.albums.isFetching;

	return {
		photos,
		albums,
		isFetching,
	}
};

const mapDispatchToProps = (dispatch) => ({
	fetchAlbums (options) {
		return dispatch(fetchAlbums(options))
	},
	fetchAllPhotos (options) {
		return dispatch(fetchAllPhotos(options))
	},
	fetchPhotosById (options) {
		return dispatch(fetchPhotosById(options))
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(PhotosWithViewer);