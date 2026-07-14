import React from 'react';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

// npx expo install react-native-svg
export default function Seal({ size = 64 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M50 2 L56 10 L65 4 L68 13 L78 10 L79 20 L89 20 L87 30 L96 33 L91 41 L98 47
        L91 53 L96 61 L88 65 L90 74 L80 75 L78 84 L69 82 L64 90 L57 84
        L50 90 L43 84 L36 90 L31 82 L22 84 L20 75 L10 74 L12 65 L4 61
        L9 53 L2 47 L9 41 L4 33 L13 30 L11 20 L21 20 L22 10 L32 13 L35 4 L44 10 Z"
        fill={colors.red}
      />
      <Circle cx={50} cy={50} r={34} fill={colors.cream} stroke={colors.ink} strokeWidth={1.5} />
      <Circle cx={50} cy={50} r={29} fill="none" stroke={colors.blue} strokeWidth={1} strokeDasharray="2 2" />
      <SvgText x={50} y={48} textAnchor="middle" fontSize={20} fontWeight="700" fill={colors.ink}>
        BAM
      </SvgText>
      <SvgText x={50} y={61} textAnchor="middle" fontSize={6.5} fontWeight="600" fill={colors.blue}>
        OFFICIAL
      </SvgText>
    </Svg>
  );
}
