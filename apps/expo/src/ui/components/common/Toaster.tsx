import { Check, Star, StarOff, X } from '@/ui/components/icons/lucide';
import { Toaster as CrispyToaster, toast } from 'crispy-toast';
import { Platform } from 'react-native';
import { useCSSVariable, useUniwind } from 'uniwind';

export { toast };

// Native toasts sit above the tab bar; web has none.
const offset = Platform.OS === 'web' ? 16 : 64;

const FavoriteIcon = ({ size }: { size?: number }) => {
	const favorite = useCSSVariable('--color-favorite') as string;
	return <Star size={size} color={favorite} fill={favorite} />;
};

const UnfavoriteIcon = ({ size }: { size?: number }) => {
	const favorite = useCSSVariable('--color-favorite') as string;
	return <StarOff size={size} color={favorite} />;
};

export const favoriteToast = (type: 'add' | 'remove', message: string) =>
	toast(message, { icon: type === 'add' ? FavoriteIcon : UnfavoriteIcon });

export const Toaster = () => {
	const { theme } = useUniwind();
	const [background, text, muted, border, success, error] = useCSSVariable([
		'--color-system-background',
		'--color-label',
		'--color-secondary-label',
		'--color-hairline',
		'--color-primary-blue',
		'--color-system-red',
	]) as string[];

	return (
		<CrispyToaster
			position="bottom-right"
			offset={offset}
			theme={theme === 'dark' ? 'dark' : 'light'}
			colors={{ background, text, muted, border, success, error }}
			icons={{ success: Check, error: X }}
		/>
	);
};
