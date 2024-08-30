import { gql } from '@apollo/client';

export const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($playlistId: String!) {
    deletePlaylist(playlistId: $playlistId) {
      message
    }
  }
`