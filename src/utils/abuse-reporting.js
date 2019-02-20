import { getUrlForModel, getDisplayNameForModel } from './models';
import { getLink, getDisplayName } from '../models/user';

/* global APP_URL */

export const getAbuseReportTitle = (model, modelType) => {
  if (modelType === 'home') {
    return 'Abuse Report for Glitch Homepage';
  }
  return `Abuse Report for ${modelType} ${getDisplayNameForModel(
    model,
    modelType,
  )}`;
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const pickEmailForReport = (currentUser, submitterEmail) => {
  if (submitterEmail) {
    return submitterEmail;
  }
  const emailObj = Array.isArray(currentUser.emails)
    && currentUser.emails.find(email => email.primary);
  return emailObj.email;
};

/*
 * mega-method to compose the body of an abuse report
 */

export const getAbuseReportBody = (
  currentUser,
  submitterEmail,
  reportedType,
  reportedModel,
  message,
) => {
  let thingIdentifiers;
  if (reportedType === 'home') {
    thingIdentifiers = `- [Glitch Home Page](${APP_URL})`;
  } else {
    const glitchLink = APP_URL + getUrlForModel(reportedModel, reportedType);
    const capitalizedReportedType = capitalize(reportedType);
    thingIdentifiers = `
- ${capitalizedReportedType} Name: [${getDisplayNameForModel(
  reportedModel,
  reportedType,
)}](${glitchLink})

- ${capitalizedReportedType} Id: ${reportedModel.id}`;
  }

  return `${thingIdentifiers}

- Submitted by: [${getDisplayName(currentUser)}](${APP_URL}${getLink(
  currentUser,
)})

- Contact: ${pickEmailForReport(currentUser, submitterEmail)}

- Message: ${message}`;
};
