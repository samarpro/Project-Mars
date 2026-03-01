import json

from django.test import TestCase


class ApiFlowTests(TestCase):
    def test_learning_mode_generates_overlap_insight(self):
        bootstrap = self.client.get('/api/bootstrap').json()
        user_id = bootstrap['user']['id']
        space_id = bootstrap['default_space']['id']

        prior_doc = self.client.post(
            '/api/documents',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'title': 'Prior',
                'mode': 'LEARNING',
            }),
            content_type='application/json',
        ).json()['document']

        prior_session = self.client.post(
            '/api/sessions',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'document_id': prior_doc['id'],
                'mode': 'LEARNING',
            }),
            content_type='application/json',
        ).json()['session']

        self.client.post(
            f"/api/documents/{prior_doc['id']}/blocks",
            data=json.dumps({
                'session_id': prior_session['id'],
                'text': 'Graph traversal uses depth first search and breadth first search.',
            }),
            content_type='application/json',
        )

        current_doc = self.client.post(
            '/api/documents',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'title': 'Current',
                'mode': 'LEARNING',
            }),
            content_type='application/json',
        ).json()['document']

        current_session = self.client.post(
            '/api/sessions',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'document_id': current_doc['id'],
                'mode': 'LEARNING',
            }),
            content_type='application/json',
        ).json()['session']

        self.client.post(
            f"/api/documents/{current_doc['id']}/blocks",
            data=json.dumps({
                'session_id': current_session['id'],
                'text': 'I studied depth first search for graph traversal practice.',
            }),
            content_type='application/json',
        )

        insights = self.client.get(f"/api/insights?session_id={current_session['id']}").json()['insights']
        self.assertGreaterEqual(len(insights), 1)

    def test_journal_mode_waits_until_finalize(self):
        bootstrap = self.client.get('/api/bootstrap').json()
        user_id = bootstrap['user']['id']
        space_id = bootstrap['default_space']['id']

        prior_doc = self.client.post(
            '/api/documents',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'title': 'Old Journal',
                'mode': 'JOURNAL',
            }),
            content_type='application/json',
        ).json()['document']

        prior_session = self.client.post(
            '/api/sessions',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'document_id': prior_doc['id'],
                'mode': 'JOURNAL',
            }),
            content_type='application/json',
        ).json()['session']

        self.client.post(
            f"/api/documents/{prior_doc['id']}/blocks",
            data=json.dumps({
                'session_id': prior_session['id'],
                'text': 'I am calm and making good progress on my project planning.',
                'finalize': True,
            }),
            content_type='application/json',
        )

        current_doc = self.client.post(
            '/api/documents',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'title': 'Today Journal',
                'mode': 'JOURNAL',
            }),
            content_type='application/json',
        ).json()['document']

        current_session = self.client.post(
            '/api/sessions',
            data=json.dumps({
                'user_id': user_id,
                'space_id': space_id,
                'document_id': current_doc['id'],
                'mode': 'JOURNAL',
            }),
            content_type='application/json',
        ).json()['session']

        self.client.post(
            f"/api/documents/{current_doc['id']}/blocks",
            data=json.dumps({
                'session_id': current_session['id'],
                'text': 'I feel confused and overwhelmed about the same project planning work.',
                'finalize': False,
            }),
            content_type='application/json',
        )

        before = self.client.get(f"/api/insights?session_id={current_session['id']}").json()['insights']
        self.assertEqual(before, [])

        self.client.post(
            f"/api/documents/{current_doc['id']}/blocks",
            data=json.dumps({
                'session_id': current_session['id'],
                'text': 'I feel confused and overwhelmed about the same project planning work.',
                'finalize': True,
            }),
            content_type='application/json',
        )

        after = self.client.get(f"/api/insights?session_id={current_session['id']}").json()['insights']
        self.assertGreaterEqual(len(after), 1)
