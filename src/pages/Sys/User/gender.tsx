import { FormattedMessage } from '@umijs/max';
export const genderValueEnum = {
  UNKNOWN: {
    text: <FormattedMessage id="sys.user.gender.unknown" defaultMessage="Unknown" />,
    status: 'Default',
  },
  MALE: {
    text: <FormattedMessage id="sys.user.gender.male" defaultMessage="Male" />,
    status: 'Default',
  },
  FEMALE: {
    text: <FormattedMessage id="sys.user.gender.female" defaultMessage="Female" />,
    status: 'Default',
  },
  OTHER: {
    text: <FormattedMessage id="sys.user.gender.other" defaultMessage="Other" />,
    status: 'Default',
  },
};
