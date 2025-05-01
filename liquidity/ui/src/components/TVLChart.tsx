import { intlFormat } from 'date-fns';
import numbro from 'numbro';
import React from 'react';
import { BorderBox } from '@snx-v3/BorderBox';

export const mockData = [
  {
    ts: '2025-02-19T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-20T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-21T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-22T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-23T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-24T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-25T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-26T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-27T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-02-28T00:00:00.000Z',
    value: '125.9824724087511088',
  },
  {
    ts: '2025-03-01T00:00:00.000Z',
    value: '775648.7409842397677397',
  },
  {
    ts: '2025-03-02T00:00:00.000Z',
    value: '1077154.9167125093691219',
  },
  {
    ts: '2025-03-03T00:00:00.000Z',
    value: '29193912.9325505584892387',
  },
  {
    ts: '2025-03-04T00:00:00.000Z',
    value: '29482870.8404797391956432',
  },
  {
    ts: '2025-03-05T00:00:00.000Z',
    value: '44999040.7688513811762771',
  },
  {
    ts: '2025-03-06T00:00:00.000Z',
    value: '84285915.1162722338865160',
  },
  {
    ts: '2025-03-07T00:00:00.000Z',
    value: '100273993.3838701258722528',
  },
  {
    ts: '2025-03-08T00:00:00.000Z',
    value: '102669755.5333526152800415',
  },
  {
    ts: '2025-03-09T00:00:00.000Z',
    value: '106297156.1626186966374213',
  },
  {
    ts: '2025-03-10T00:00:00.000Z',
    value: '108034692.7521441575751180',
  },
  {
    ts: '2025-03-11T00:00:00.000Z',
    value: '108841053.2243643459114518',
  },
  {
    ts: '2025-03-12T00:00:00.000Z',
    value: '109166096.1843327100397158',
  },
  {
    ts: '2025-03-13T00:00:00.000Z',
    value: '110211654.8346958311190234',
  },
  {
    ts: '2025-03-14T00:00:00.000Z',
    value: '133503372.6121232272179741',
  },
  {
    ts: '2025-03-15T00:00:00.000Z',
    value: '133625965.6374132861303327',
  },
  {
    ts: '2025-03-16T00:00:00.000Z',
    value: '133709545.8284174521134874',
  },
  {
    ts: '2025-03-17T00:00:00.000Z',
    value: '135177292.640841791593378000000000000000000000',
  },
  {
    ts: '2025-03-18T00:00:00.000Z',
    value: '135641322.306701197132115500000000000000000000',
  },
  {
    ts: '2025-03-19T00:00:00.000Z',
    value: '135711276.375493053757253100000000000000000000',
  },
  {
    ts: '2025-03-20T00:00:00.000Z',
    value: '137093827.790377064893148900000000000000000000',
  },
  {
    ts: '2025-03-21T00:00:00.000Z',
    value: '137299003.995839209406186900000000000000000000',
  },
  {
    ts: '2025-03-22T00:00:00.000Z',
    value: '137518976.468728551796621900000000000000000000',
  },
  {
    ts: '2025-03-23T00:00:00.000Z',
    value: '137611374.460468473877009500000000000000000000',
  },
  {
    ts: '2025-03-24T00:00:00.000Z',
    value: '137984134.761665575454511600000000000000000000',
  },
  {
    ts: '2025-03-25T00:00:00.000Z',
    value: '138246176.419584018119433100000000000000000000',
  },
  {
    ts: '2025-03-26T00:00:00.000Z',
    value: '138345658.216473357797632200000000000000000000',
  },
  {
    ts: '2025-03-27T00:00:00.000Z',
    value: '138368334.550865253653880200000000000000000000',
  },
  {
    ts: '2025-03-28T00:00:00.000Z',
    value: '138853000.453288240287377200000000000000000000',
  },
  {
    ts: '2025-03-29T00:00:00.000Z',
    value: '138917479.077880774465689300000000000000000000',
  },
  {
    ts: '2025-03-30T00:00:00.000Z',
    value: '138941121.089867255464017700000000000000000000',
  },
  {
    ts: '2025-03-31T00:00:00.000Z',
    value: '139600300.373044051982939800000000000000000000',
  },
  {
    ts: '2025-04-01T00:00:00.000Z',
    value: '139556045.891367220645411200000000000000000000',
  },
  {
    ts: '2025-04-02T00:00:00.000Z',
    value: '139737295.734122726278734900000000000000000000',
  },
  {
    ts: '2025-04-03T00:00:00.000Z',
    value: '146183822.077683497861147400000000000000000000',
  },
  {
    ts: '2025-04-04T00:00:00.000Z',
    value: '146274139.701249662875688828000000000000000000',
  },
  {
    ts: '2025-04-05T00:00:00.000Z',
    value: '146359588.036754236630769363000000000000000000',
  },
  {
    ts: '2025-04-06T00:00:00.000Z',
    value: '146740033.730952384299803507000000000000000000',
  },
  {
    ts: '2025-04-07T00:00:00.000Z',
    value: '146793358.601108552547788212000000000000000000',
  },
  {
    ts: '2025-04-08T00:00:00.000Z',
    value: '147001746.467076623236880012000000000000000000',
  },
  {
    ts: '2025-04-09T00:00:00.000Z',
    value: '147187904.137260684883311512000000000000000000',
  },
].map(({ ts, value }: { ts: string; value: string }) => ({
  ts: new Date(ts),
  value: Number.parseFloat(value),
}));

export function TvlChart({
  config = {
    width: 1000,
    height: 380,
    fontSize: 30,
  },
}: {
  config?: {
    width: number;
    height: number;
    fontSize: number;
  };
}) {
  const [hover, setHover] = React.useState<{ x: number; y: number } | null>(null);
  const handleMouseMove = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    const rectElement = event.target as SVGRectElement;
    if (rectElement) {
      const rect = rectElement.getBoundingClientRect();
      // Calculate the normalized X value relative to the SVG's viewBox
      const normalizedX = ((event.clientX - rect.left) / rect.width) * config.width; // Scale X to viewBox scale (0 to config.width)
      const normalizedY = ((event.clientX - rect.left) / rect.width) * config.height; // Scale X to viewBox scale (0 to config.width)
      setHover({ x: normalizedX, y: normalizedY });
    }
  };

  const handleMouseLeave = () => {
    setHover(null); // Clear the hoverX when the mouse leaves the chart
  };

  const POINTS = React.useMemo(() => {
    if (!mockData) {
      return [];
    }
    return mockData.map((point, i): { x: number; y: number; v: number; ts: Date } => {
      const x = (config.width / (mockData.length - 1)) * i; // Scale X values to fit within the SVG width (1000px viewBox width)
      const y = config.height - (point.value / mockData[mockData.length - 1].value) * config.height; // Scale Y values (assuming max value is 1,000,000)
      const v = point.value; // Value from data
      const ts = point.ts; // Timestamp from data
      return { x, y, v, ts }; // Push structured data to points
    });
  }, [config]);
  const [FIRST_POINT] = POINTS;
  const [LAST_POINT] = POINTS.slice(-1);

  // Helper: Find Y for a given X by interpolating the `POINTS`
  const getPoint = React.useCallback(
    (
      x: number
    ): {
      x: number;
      y: number;
      v: number;
      ts: Date;
    } => {
      for (let i = 0; i < POINTS.length - 1; i++) {
        const { x: x1, y: y1 } = POINTS[i];
        const { x: x2, y: y2 } = POINTS[i + 1];
        if (x >= x1 && x <= x2 && POINTS[i + 1]) {
          // Perform linear interpolation to find the Y-value
          const t = (x - x1) / (x2 - x1); // Ratio between x1 and x2
          return {
            ...POINTS[i + 1],
            x,
            y: y1 + t * (y2 - y1),
          };
        }
      }
      if (x > config.width / 2 && LAST_POINT) {
        return LAST_POINT;
      }
      if (x < config.width / 2 && FIRST_POINT) {
        return FIRST_POINT;
      }
      // Default fail-safe
      return { x: 0, y: config.height, v: 0, ts: new Date() };
    },
    [POINTS, config, FIRST_POINT, LAST_POINT]
  );

  return (
    <BorderBox
      alignSelf="self-start"
      flex={1}
      width="100%"
      border="none"
      flexDir="column"
      p={['4', '6']}
      gap={6}
    >
      <svg
        viewBox={`-100 -20 ${config.width + 100 + 20} ${config.height + config.fontSize + 20 + 20}`}
        width="100%"
        aria-label="TVL Chart"
        role="img"
      >
        {POINTS.length > 0 ? (
          <>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={config.height}
              stroke="#2d2d38"
              strokeWidth="3"
              // strokeDasharray="5"
            />
            <defs>
              <linearGradient id="gradientFill" x1={0} y1={0} x2={0} y2={1}>
                {/* Opaque color at the top */}
                <stop offset="0%" stopColor="#00D1FF" stopOpacity="1" />
                {/* Transparent at the bottom */}
                <stop offset="100%" stopColor="#00D1FF" stopOpacity="0.04" />{' '}
              </linearGradient>
            </defs>
            {/* Stroke Path (Smooth line) */}
            <path
              fill="none" // No fill for the stroke line
              stroke="#00D1FF"
              strokeWidth="2"
              d={`
              M ${POINTS[0].x},${POINTS[0].y}
              ${POINTS.slice(1)
                .map(
                  (point, i) =>
                    `C ${POINTS[i].x + (point.x - POINTS[i].x) / 2},${POINTS[i].y} ` +
                    `${point.x - (point.x - POINTS[i].x) / 2},${point.y} ` +
                    `${point.x},${point.y}`
                )
                .join(' ')}
            `}
            />

            {/* Area Fill (without bottom return line) */}
            <path
              fill="url(#gradientFill)" // Link to the gradient
              stroke="none" // No stroke for the fill
              d={`
              M ${POINTS[0].x},${POINTS[0].y} 
              ${POINTS.slice(1)
                .map(
                  (point, i) =>
                    `C ${POINTS[i].x + (point.x - POINTS[i].x) / 2},${POINTS[i].y} ` +
                    `${point.x - (point.x - POINTS[i].x) / 2},${point.y} ` +
                    `${point.x},${point.y}`
                )
                .join(' ')}
              L ${POINTS[POINTS.length - 1].x},${config.height} 
              L ${POINTS[0].x},${config.height} 
              Z
            `}
            />
          </>
        ) : (
          <>
            <line x1="0" y1="0" x2="0" y2={config.height} stroke="#2D2D38" strokeWidth="1" />
            <line
              x1="0"
              y1={config.height}
              x2={config.width}
              y2={config.height}
              stroke="#2d2d38"
              strokeWidth="1"
            />
          </>
        )}

        {FIRST_POINT ? (
          <text
            x={10}
            y={config.height + config.fontSize + 10}
            fill="#9999ac"
            fontSize={config.fontSize}
            textAnchor="start"
          >
            {intlFormat(FIRST_POINT.ts, {
              year: '2-digit',
              month: 'short',
            })}
          </text>
        ) : null}
        {LAST_POINT ? (
          <text
            x={config.width - 10}
            y={config.height + config.fontSize + 10}
            fill="#9999ac"
            fontSize={config.fontSize}
            textAnchor="end"
          >
            {intlFormat(LAST_POINT.ts, {
              year: '2-digit',
              month: 'short',
            })}
          </text>
        ) : null}
        {LAST_POINT ? (
          <text
            x="-15"
            y={config.fontSize - 3}
            fill="#9999ac"
            fontSize={config.fontSize}
            textAnchor="end"
          >
            {`${numbro(LAST_POINT.v).format({
              trimMantissa: true,
              thousandSeparated: true,
              average: true,
              mantissa: 0,
              spaceSeparated: false,
            })}`}
          </text>
        ) : null}
        {/*
      {FIRST_POINT ? (
        <text x="-15" y="307" fill="#9999ac" fontSize={config.fontSize} textAnchor="end">
          {`${numbro(FIRST_POINT.v).format({
            trimMantissa: true,
            thousandSeparated: true,
            average: true,
            mantissa: 0,
            spaceSeparated: false,
          })}`}
        </text>
      ) : null}
      */}

        {hover !== null ? (
          <>
            {/*
          <line
            x1={hover.x}
            y1="0"
            x2={hover.x}
            y2={config.height}
            stroke="#aaa"
            strokeWidth="1"
            strokeDasharray="4" // Dashed line
          />
          */}

            <circle cx={hover.x} cy={getPoint(hover.x).y} r="16" fill="#5CE1FF" />

            <g
              transform={`translate(${[
                hover.x + (hover.x > config.width / 2 ? -config.fontSize * 10 - 20 : 20),
                getPoint(hover.x).y +
                  (getPoint(hover.x).y > config.height / 2 ? -config.fontSize * 1.5 * 3 - 20 : 20),
              ].join(',')})`}
            >
              <rect
                x={0}
                y={0}
                width={config.fontSize * 10}
                height={config.fontSize * 1.5 * 3}
                rx="10"
                ry="10"
                fill="#06061B99"
              />

              <text
                x={config.fontSize * 5}
                y={config.fontSize * 1.5}
                fill="#9999AC"
                fontSize={config.fontSize * 0.9}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {intlFormat(getPoint(hover.x).ts, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </text>

              <text
                x={config.fontSize * 5}
                y={config.fontSize * 1.5 * 2}
                fill="#FFFFFF"
                fontSize={config.fontSize}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {`${numbro(getPoint(hover.x).v).format({
                  trimMantissa: true,
                  thousandSeparated: true,
                  average: false,
                  mantissa: 0,
                  spaceSeparated: false,
                })} SNX`}
              </text>
            </g>
          </>
        ) : null}

        <rect
          x={0}
          y={0}
          width={config.width}
          height={config.height}
          fill="transparent"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </svg>
    </BorderBox>
  );
}
