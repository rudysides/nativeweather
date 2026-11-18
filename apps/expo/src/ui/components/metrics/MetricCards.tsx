import { View } from 'react-native';
import { clsx } from 'clsx';
import { Skeleton } from '../common/Skeleton';
import { getPrecipitationMetric } from './definitions/precipitation';
import { MetricCard, metricCellClassName, useSixTiles } from './MetricCard';
import type { MetricLayout } from './MetricCard';
import { metricDefinitions } from './registry';
import type { MetricId } from './registry';
import { useMetricContext } from './useMetricContext';

interface MetricCardsProps {
	/** A forecast day shows its own four cards; omitted, the grid shows current conditions. */
	dayIndex?: number;
	/** `day` is set for metrics whose modal charts a day. */
	onOpen: (metric: MetricId, day?: number) => void;
	/** Laid out in a narrow column, three tiles per row. */
	column?: boolean;
}

export const MetricCards = ({ dayIndex, onOpen, column = false }: MetricCardsProps) => {
	const context = useMetricContext();
	const sixTiles = useSixTiles();

	if (!context) return null;

	const source = dayIndex ?? null;
	const layout: MetricLayout = column ? 'column' : source === null ? 'row' : 'day';
	const precipitation = getPrecipitationMetric(context.weather, source);
	const metrics: MetricId[] =
		source === null
			? column
				? // Nine tiles fill three even rows, so clouds is left out.
					[precipitation, 'wind', 'uv', 'range', 'humidity', 'pressure', 'sunrise', 'sunset', 'moon']
				: // UV ends the first row, under the map: after two squares in a row of four, after four in a row of six.
					// Moon ends the last.
					sixTiles
					? [precipitation, 'wind', 'range', 'humidity', 'uv', 'pressure', 'clouds', 'sunrise', 'sunset', 'moon']
					: [precipitation, 'wind', 'uv', 'range', 'humidity', 'pressure', 'clouds', 'sunrise', 'sunset', 'moon']
			: [precipitation, 'wind', 'uv', 'range'];

	return (
		<View className="-m-2 flex-row flex-wrap">
			{metrics.map((metric) => {
				const definition = metricDefinitions[metric];
				return (
					<MetricCard
						key={metric}
						definition={definition}
						title={context.t(definition.titleKey)}
						content={definition.card(context, source)}
						onPress={() => onOpen(metric, definition.usesDate ? (dayIndex ?? 0) : undefined)}
						layout={layout}
					/>
				);
			})}
		</View>
	);
};

const square = {};
const columnTiles = Array.from({ length: 9 }, () => square);
const wide = { wide: true };
const squares = (length: number) => Array.from({ length }, () => square);
// UV and moon end a row: after four squares in a row of six, after two in a row of four.
const sixTileRow = [...squares(4), wide, ...squares(4), wide];
const fourTileRow = [...squares(2), wide, ...squares(6), wide];

/** Mirrors the current conditions' grid, so the page does not jump when the data arrives. */
export const MetricCardsSkeleton = ({ column = false }: { column?: boolean }) => {
	const sixTiles = useSixTiles();

	return (
		<View className="-m-2 flex-row flex-wrap">
			{(column ? columnTiles : sixTiles ? sixTileRow : fourTileRow).map((tile, index) => (
				<View
					key={index}
					// Without content to size them, the wide ones take the height of a row of squares.
					className={clsx(metricCellClassName(column ? 'column' : 'row', tile), 'wide' in tile && 'aspect-[2/1]')}
				>
					<Skeleton fill />
				</View>
			))}
		</View>
	);
};
