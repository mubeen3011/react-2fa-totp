import * as react from 'react';

interface TwoFactorAuthProps {
    apiEndpoint: string;
    onEnabled?: () => void;
    onDisabled?: () => void;
    onError?: (msg: string) => void;
}
declare function TwoFactorAuth({ apiEndpoint, onEnabled, onDisabled, onError }: TwoFactorAuthProps): react.JSX.Element;

export { type TwoFactorAuthProps, TwoFactorAuth as default };
