export type Movement = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'FORWARD' | 'BACKWARD' | 'ROTATE_CW' | 'ROTATE_CCW' | 'STOP';

export interface MachineState {
  vertical: number; // 0-100
  horizontal: number; // 0-100
  rotation: number; // -180 to 180
  isExposing: boolean;
  lastCommand: string;
  status: 'IDLE' | 'MOVING' | 'EXPOSING' | 'ERROR';
}

export const COMMAND_KEYWORDS = {
  UP: ['up', 'higher', 'elevate'],
  DOWN: ['down', 'lower'],
  LEFT: ['left', 'port'],
  RIGHT: ['right', 'starboard'],
  FORWARD: ['forward', 'front', 'in'],
  BACKWARD: ['backward', 'back', 'out'],
  ROTATE_CW: ['rotate clockwise', 'turn right'],
  ROTATE_CCW: ['rotate counter clockwise', 'turn left'],
  STOP: ['stop', 'halt', 'freeze', 'cancel'],
  EXPOSE: ['expose', 'shoot', 'capture', 'take picture', 'x-ray']
};
