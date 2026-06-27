const Skeletion = ({ className, ...props }) => {
	return (
		<div
			className={`skeleton-shimmer rounded-xl ${className || ''}`}
			{...props}
		/>
	);
};

export default Skeletion;
