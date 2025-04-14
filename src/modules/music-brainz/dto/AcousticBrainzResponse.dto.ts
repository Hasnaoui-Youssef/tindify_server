interface HighLevelField {
  all : {
    [label : string] : number;
  }
}

interface HighLevelData {
  [category : string] : HighLevelField ;
}

interface RecordingData {
  highlevel : HighLevelData;
}

export interface AcousticBrainzResponse{
  [rid : string] : RecordingData;
}
