module.exports = {
  name: 'ui-organism-ui-bootstrap-search',
  preset: '../../../../jest.config.js',
  coverageDirectory:
    '../../../../coverage/libs/ui/organism/ui-bootstrap-search',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
