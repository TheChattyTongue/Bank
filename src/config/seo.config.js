const SITE_NAME = 'Bank'

export const getTitle = title => {
	return title ? `${SITE_NAME} | ${title}` : SITE_NAME
}
